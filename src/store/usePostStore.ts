import { create } from "zustand";
import { PostData } from "@/components/features/community/PostCard";

const SAMPLE_POSTS: PostData[] = [
  {
    id: "1",
    author: {
      id: "1",
      name: "Adel Ghamri",
      avatar: "/images/profile1.png",
      title: "Full-Stack Developer",
    },
    content:
      "Just shipped a new feature that reduces load time by 40%! The key was optimizing our database queries and implementing smart caching. Here's what worked...",
    image: "/images/post-placeholder.png",
    timestamp: "2h ago",
    likes: 24,
    comments: 8,
    shares: 2,
  },
  {
    id: "2",
    author: {
      id: "2",
      name: "Sara",
      avatar: "/images/profile2.png",
      title: "UI/UX Designer",
    },
    content:
      "Anyone else excited about the new design trends for 2024? I'm particularly loving the return to minimalism with bold typography. What are your thoughts?",
    timestamp: "4h ago",
    likes: 34,
    comments: 12,
    shares: 5,
  },
  {
    id: "3",
    author: {
      id: "3",
      name: "Parker",
      avatar: "/images/avatar.png",
      title: "Frontend Engineer",
    },
    content:
      "Quick tip: Always use semantic HTML elements. It's not just for accessibility — it also helps with SEO and makes your code more maintainable. Small changes, big impact! ✨",
    timestamp: "4h ago",
    likes: 24,
    comments: 6,
    shares: 3,
  },
  {
    id: "4",
    author: {
      id: "4",
      name: "William",
      avatar: "/images/avatar.png",
      title: "Product Manager",
    },
    content:
      "I'm trying to book an appointment but the assistant isn't picking up the phone. Can I book here?",
    timestamp: "8h ago",
    likes: 4,
    comments: 1,
    shares: 0,
  },
  {
    id: "p1",
    author: { name: "Emad", avatar: "/images/avatar.png", title: "Full Stack Developer" },
    content: "🚀 Just launched a real-time collaboration tool — React, WebSockets & Node.js. Live cursors, shared state, conflict-free merging. Drop a ⭐ if you like it! #OpenSource #React #WebSockets",
    image: "/images/post-placeholder.png",
    timestamp: "2h ago",
    likes: 247,
    comments: 38,
    shares: 12,
  },
  {
    id: "p2",
    author: { name: "Emad", avatar: "/images/avatar.png", title: "Full Stack Developer" },
    content: "Explored GPT-4 Turbo for developer tooling 🔥\nKey insight: The most dangerous AI won't have bad intentions — it'll just have bad developers.\n#AI #DevTools",
    timestamp: "3d ago",
    likes: 183,
    comments: 52,
    shares: 8,
  },
  {
    id: "p3",
    author: { name: "Emad", avatar: "/images/avatar.png", title: "Full Stack Developer" },
    content: "Stop using useEffect for everything\n🔴 • useMemo for values •\nuseCallback for functions •\nReact.memo prevents re-renders.\nSave this post.",
    timestamp: "3d ago",
    likes: 312,
    comments: 44,
    shares: 21,
  },
];

interface PostStore {
  posts: PostData[];
  addPost: (post: PostData) => void;
}

export const usePostStore = create<PostStore>((set: any) => ({
  posts: SAMPLE_POSTS,
  addPost: (post: PostData) => set((state: any) => ({ posts: [post, ...state.posts] })),
}));
