import { create } from "zustand";
import { PostData } from "@/components/features/community/PostCard";
import { communityService } from "@/lib/api/services/community.service";
import { uploadService } from "@/lib/api/services/upload.service";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface PostStore {
  posts: PostData[];
  isLoading: boolean;
  fetchFeed: (userId?: string) => Promise<void>;
  addPost: (content: string, image?: string, link?: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  editPost: (id: string, content: string) => Promise<void>;
  toggleLike: (postId: string, userId: string) => Promise<void>;
  addOptimisticPost: (post: Partial<PostData>) => void;
  updatePostUploadStatus: (id: string, updates: Partial<PostData>) => void;
  finalizePost: (tempId: string, finalPost: any) => void;
  retryPost: (tempId: string) => Promise<void>;
}

const mapBackendPost = (post: any): PostData => {
  let userObj = post.userId;
  if (typeof userObj === 'string' && typeof window !== "undefined") {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUserId = storedUser.id || storedUser._id;
      if (userObj === currentUserId) {
        const reactiveAvatar = localStorage.getItem('thalorix_user_avatar');
        userObj = {
          _id: currentUserId,
          id: currentUserId,
          name: storedUser.name || storedUser.username || "User",
          avatar: reactiveAvatar || storedUser.avatar || storedUser.avatarUrl || storedUser.logo || "/images/avatar.png",
          avatarUrl: reactiveAvatar || storedUser.avatarUrl || storedUser.avatar || storedUser.logo || "/images/avatar.png",
          role: storedUser.role || "user",
        };
      }
    } catch (e) {
      console.warn("Error parsing stored user in mapBackendPost:", e);
    }
  }

  return {
    id: post._id,
    author: {
      id: userObj?._id || userObj?.id || (typeof userObj === 'string' ? userObj : undefined),
      name: userObj?.name || "Unknown User",
      avatar: userObj?.avatarUrl || userObj?.avatar || userObj?.logo || "/images/avatar.png",
      title: userObj?.role ? userObj.role.charAt(0).toUpperCase() + userObj.role.slice(1) : "User",
    },
    content: post.content,
    image: post.image,
    link: post.link,
    timestamp: dayjs(post.createdAt).fromNow(),
    likes: post.likesCount || 0,
    comments: post.commentsCount || 0,
    shares: 0,
    liked: post.liked || false,
  };
};

export const usePostStore = create<PostStore>((set: any, get: any) => ({
  posts: [],
  isLoading: false,
  fetchFeed: async (userId?: string) => {
    set({ isLoading: true });
    try {
      const data = await communityService.getFeed(userId);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const currentUserId = currentUser?.id || currentUser?._id || 'guest';
      const savedLikes = JSON.parse(localStorage.getItem(`liked_posts_${currentUserId}`) || '[]');
      
      const mappedPosts = data.map((backendPost: any) => {
        const post = mapBackendPost(backendPost);
        // Apply local likes since backend isn't tracking it
        if (savedLikes.includes(post.id)) {
          post.liked = true;
          // Increment display count because backend doesn't know about this like
          post.likes += 1;
        }
        return post;
      });
      
      set({ posts: mappedPosts, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch feed:", error);
      set({ isLoading: false });
    }
  },
  addPost: async (content: string, image?: string, link?: string) => {
    try {
      const newPost = await communityService.createPost(content, image, link);
      set((state: any) => ({ posts: [mapBackendPost(newPost), ...state.posts] }));
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  },
  deletePost: async (id: string) => {
    try {
      if (!id.startsWith("temp_")) {
        await communityService.deletePost(id);
      } else {
        const post = get().posts.find((p: any) => p.id === id);
        if (post?.localMediaBlob) {
          URL.revokeObjectURL(post.localMediaBlob);
        }
      }
      set((state: any) => ({ posts: state.posts.filter((p: PostData) => p.id !== id) }));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  },
  editPost: async (id: string, content: string) => {
    try {
      const updatedPost = await communityService.updatePost(id, content);
      set((state: any) => ({
        posts: state.posts.map((p: PostData) => p.id === id ? { ...p, content: updatedPost.content } : p)
      }));
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  },
  toggleLike: async (postId: string, userId: string) => {
    try {
      // Toggle like state optimistic update
      set((state: any) => ({
        posts: state.posts.map((p: PostData) => p.id === postId ? { 
          ...p, 
          liked: !p.liked, 
          likes: p.liked ? p.likes - 1 : p.likes + 1 
        } : p)
      }));
      
      // Save locally (Frontend-only approach as requested)
      const likedKey = `liked_posts_${userId}`;
      const savedLikes = JSON.parse(localStorage.getItem(likedKey) || '[]');
      const currentPosts = get().posts;
      const updatedPost = currentPosts.find((p: PostData) => p.id === postId);
      
      if (updatedPost?.liked) {
        if (!savedLikes.includes(postId)) savedLikes.push(postId);
      } else {
        const idx = savedLikes.indexOf(postId);
        if (idx > -1) savedLikes.splice(idx, 1);
      }
      
      localStorage.setItem(likedKey, JSON.stringify(savedLikes));
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  },
  addOptimisticPost: (post: Partial<PostData>) => {
    set((state: any) => ({
      posts: [
        {
          id: `temp_${Date.now()}`,
          author: { name: "User", avatar: "/images/avatar.png" }, // Will be overridden
          content: "",
          timestamp: "Just now",
          likes: 0,
          comments: 0,
          shares: 0,
          ...post,
        },
        ...state.posts
      ]
    }));
  },
  updatePostUploadStatus: (id: string, updates: Partial<PostData>) => {
    set((state: any) => ({
      posts: state.posts.map((p: PostData) => 
        p.id === id ? { ...p, ...updates } : p
      )
    }));
  },
  finalizePost: (tempId: string, finalPost: any) => {
    set((state: any) => ({
      posts: state.posts.map((p: PostData) => 
        p.id === tempId ? mapBackendPost(finalPost) : p
      )
    }));
  },
  retryPost: async (tempId: string) => {
    const state = get();
    const post = state.posts.find((p: any) => p.id === tempId);
    if (!post || !post.isUploading && !post.uploadError) return;

    // Reset error and set uploading
    set((state: any) => ({
      posts: state.posts.map((p: PostData) => 
        p.id === tempId ? { ...p, uploadError: undefined, isUploading: true, uploadProgress: 0 } : p
      )
    }));

    try {
      let imageUrl: string | undefined = undefined;
      if (post.localMediaFile) {
        const uploadRes = await uploadService.uploadFile(post.localMediaFile, "posts", (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            set((state: any) => ({
              posts: state.posts.map((p: PostData) => 
                p.id === tempId ? { ...p, uploadProgress: progress } : p
              )
            }));
          }
        });
        imageUrl = uploadRes.url;
      }
        
      const newPost = await communityService.createPost(post.content, imageUrl, post.link);
      
      set((state: any) => ({
        posts: state.posts.map((p: PostData) => 
          p.id === tempId ? mapBackendPost(newPost) : p
        )
      }));
    } catch (error: any) {
      console.error("Failed to retry post:", error);
      set((state: any) => ({
        posts: state.posts.map((p: PostData) => 
          p.id === tempId ? { ...p, isUploading: false, uploadError: error.message || "Failed to post. Please try again." } : p
        )
      }));
    }
  },
}));
