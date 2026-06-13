import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, ChevronRight, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { usersService } from "@/lib/api/services/users.service";
import { authService } from "@/lib/api/services/auth.service";

export default function ProfileRightSidebar() {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState<Record<string, 'idle' | 'loading' | 'sent'>>({});

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        let suggestedUsers = [];
        try {
          const res = await usersService.getSuggestions();
          suggestedUsers = res?.users || res || [];
        } catch (err) {
          console.warn("getSuggestions failed, falling back to getAllUsers");
        }
        
        if (!suggestedUsers || suggestedUsers.length === 0) {
          const fallbackData = await usersService.getAllUsers({ limit: 10 });
          suggestedUsers = fallbackData.users || [];
        }

        const storedUser = authService.getStoredUser();
        const currentUserId = storedUser?.id || (storedUser as any)?._id;
        
        // Filter out current user
        const filtered = suggestedUsers.filter((u: any) => {
           const uId = u.id || u._id;
           return uId !== currentUserId;
        });

        // Limit to 4
        setSuggestions(filtered.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  const handleAdd = async (userId: string) => {
    if (!userId) return;
    setRequestStatus(prev => ({ ...prev, [userId]: 'loading' }));
    try {
      await usersService.sendFriendRequest(userId);
      setRequestStatus(prev => ({ ...prev, [userId]: 'sent' }));
    } catch (error) {
      console.error("Failed to send friend request:", error);
      setRequestStatus(prev => ({ ...prev, [userId]: 'idle' }));
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  // Generate consistent colors for avatars
  const getAvatarColor = (id: string) => {
    const colors = ["#2563eb", "#7c3aed", "#dc2626", "#059669", "#d97706", "#0891b2"];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
       hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="w-full lg:w-[300px] flex-shrink-0">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="space-y-5 lg:sticky lg:top-24"
      >
      {/* Grow Your Network */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Grow Your Network</h3>
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((person, i) => {
              const pId = person.id || person._id;
              const pName = person.name || person.username || "User";
              const avatar = person.avatarUrl || person.avatar || person.logo;
              const pTitle = person.role || "Member";
              const status = requestStatus[pId] || 'idle';

              return (
                <div key={pId || i} className="flex items-center gap-3">
                  <Link href={`/dashboard/profile/${pId}`}>
                    {avatar && !avatar.includes('avatar.png') ? (
                      <img src={avatar} alt={pName} className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-gray-100 hover:opacity-80 transition-opacity" />
                    ) : (
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: getAvatarColor(pId || pName) }}
                      >
                        {getInitials(pName)}
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/dashboard/profile/${pId}`}>
                      <p className="text-sm font-semibold text-gray-800 hover:text-teal-600 transition-colors truncate">{pName}</p>
                    </Link>
                    <p className="text-[11px] text-gray-400 truncate capitalize">{pTitle}</p>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {status === 'sent' ? (
                      <motion.div
                        key="sent"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs font-semibold text-gray-400 flex items-center gap-0.5 flex-shrink-0 bg-gray-50 px-2 py-1.5 rounded-md border border-gray-100"
                      >
                        <Check size={13} /> Sent
                      </motion.div>
                    ) : (
                      <motion.button
                        key="add"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAdd(pId)}
                        disabled={status === 'loading'}
                        className="text-xs font-semibold text-teal-600 hover:text-teal-700 disabled:opacity-50 transition-colors flex items-center gap-0.5 flex-shrink-0 bg-teal-50 hover:bg-teal-100 px-2 py-1.5 rounded-md"
                      >
                        {status === 'loading' ? <Loader2 size={13} className="animate-spin" /> : <><UserPlus size={13} /> Add</>}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-center text-gray-400 py-2">No suggestions right now.</p>
          )}

          {suggestions.length > 0 && (
            <Link href="/dashboard/community" className="w-full text-center text-xs font-semibold text-teal-600 hover:text-teal-700 mt-2 transition-colors flex items-center justify-center gap-1 pt-2 border-t border-gray-50">
              View all suggestions <ChevronRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-3 space-y-1">
        <div className="flex items-center justify-center gap-3 text-[11px] text-gray-400">
          <a href="#" className="hover:text-gray-600 transition-colors">About</a>
          <span>·</span>
          <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
          <span>·</span>
          <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
          <span>·</span>
          <a href="#" className="hover:text-gray-600 transition-colors">Help</a>
        </div>
        <p className="text-[11px] text-gray-300">© 2026 Thalorix</p>
      </div>
      </motion.div>
    </div>
  );
}
