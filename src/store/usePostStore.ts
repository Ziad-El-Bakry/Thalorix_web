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
  addPost: (content: string, image?: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  editPost: (id: string, content: string) => Promise<void>;
  toggleLike: (postId: string, userId: string) => Promise<void>;
  addOptimisticPost: (post: Partial<PostData>) => void;
  updatePostUploadStatus: (id: string, updates: Partial<PostData>) => void;
  finalizePost: (tempId: string, finalPost: any) => void;
  retryPost: (tempId: string) => Promise<void>;
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

export const usePostStore = create<PostStore>((set: any, get: any) => ({
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
        
      const newPost = await communityService.createPost(post.content, imageUrl);
      
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
