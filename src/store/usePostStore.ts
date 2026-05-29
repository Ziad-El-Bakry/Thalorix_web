import { create } from "zustand";
import { PostData } from "@/components/features/community/PostCard";
import { communityService } from "@/lib/api/services/community.service";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface PostStore {
  posts: PostData[];
  isLoading: boolean;
  fetchFeed: (userId?: string) => Promise<void>;
  addPost: (content: string, image?: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  editPost: (id: string, content: string) => Promise<void>;
  toggleLike: (postId: string, userId: string) => Promise<void>;
}

const mapBackendPost = (post: any): PostData => ({
  id: post._id,
  author: {
    id: post.userId?._id || post.userId?.id,
    name: post.userId?.name || "Unknown User",
    avatar: post.userId?.avatarUrl || "/images/avatar.png",
    title: post.userId?.role ? post.userId.role.charAt(0).toUpperCase() + post.userId.role.slice(1) : "User",
  },
  content: post.content,
  image: post.image,
  timestamp: dayjs(post.createdAt).fromNow(),
  likes: post.likesCount || 0,
  comments: post.commentsCount || 0,
  shares: 0,
  liked: post.liked || false,
});

export const usePostStore = create<PostStore>((set: any) => ({
  posts: [],
  isLoading: false,
  fetchFeed: async (userId?: string) => {
    set({ isLoading: true });
    try {
      const data = await communityService.getFeed(userId);
      set({ posts: data.map(mapBackendPost), isLoading: false });
    } catch (error) {
      console.error("Failed to fetch feed:", error);
      set({ isLoading: false });
    }
  },
  addPost: async (content: string, image?: string) => {
    try {
      const newPost = await communityService.createPost(content, image);
      set((state: any) => ({ posts: [mapBackendPost(newPost), ...state.posts] }));
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  },
  deletePost: async (id: string) => {
    try {
      await communityService.deletePost(id);
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
      // Optimistic update
      set((state: any) => ({
        posts: state.posts.map((p: PostData) => p.id === postId ? { 
          ...p, 
          liked: !p.liked, 
          likes: p.liked ? p.likes - 1 : p.likes + 1 
        } : p)
      }));
      
      const result = await communityService.toggleLike(postId, userId);
      
      // Update with actual backend state
      set((state: any) => ({
        posts: state.posts.map((p: PostData) => p.id === postId ? { 
          ...p, 
          liked: result.liked, 
          likes: result.likesCount 
        } : p)
      }));
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // Revert optimistic update could be handled here
    }
  },
}));
