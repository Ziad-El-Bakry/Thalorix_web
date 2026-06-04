// ============================================
// ADMIN MOCK DATA
// ============================================

export interface AdminPost {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    initials: string;
    role: string;
    color: string;
  };
  category: string;
  categoryColor: string;
  date: string;
  likes: number;
  comments: number;
  status: "Published" | "Draft" | "Flagged" | "Hidden";
  featured: boolean;
}

export interface AdminProduct {
  id: string;
  name: string;
  seller: {
    name: string;
    initials: string;
    color: string;
  };
  price: number;
  sales: number;
  revenue: number;
  status: "Active" | "Suspended" | "Removed";
  category: string;
}

export interface AdminUser {
  id: string;
  name: string;
  initials: string;
  role: string;
  color: string;
  isAdmin: boolean;
  permissions: {
    post: boolean;
    buy: boolean;
    templates: boolean;
    comment: boolean;
    message: boolean;
    admin: boolean;
  };
}

export interface ActivityItem {
  id: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  message: string;
  time: string;
}

export interface FlaggedPost {
  id: string;
  title: string;
  author: string;
  initials: string;
  color: string;
}

export interface PendingOrder {
  id: string;
  product: string;
  buyer: string;
  price: string;
  initials: string;
  color: string;
}

export interface RestrictedUser {
  id: string;
  name: string;
  restrictions: string[];
  initials: string;
  color: string;
}

// ============================================
// STATS
// ============================================
export const mockStats = {
  totalPosts: 15,
  publishedPosts: 9,
  flaggedPosts: 3,
  totalOrders: 12,
  completedOrders: 8,
  revenue: 447,
};

// ============================================
// POSTS
// ============================================
export const mockPosts: AdminPost[] = [
  {
    id: "1",
    title: "Building Scalable Design Systems in 2026",
    excerpt: "A deep dive into component architecture",
    author: { name: "Sophia Smith", initials: "SS", role: "Designer", color: "#6366f1" },
    category: "DESIGN",
    categoryColor: "#6366f1",
    date: "02 May 2026",
    likes: 312,
    comments: 47,
    status: "Published",
    featured: true,
  },
  {
    id: "2",
    title: "Why TypeScript Changed Everything",
    excerpt: "After 3 years of plain JS, here's what made me switch",
    author: { name: "Liam Johnson", initials: "LJ", role: "Developer", color: "#0891b2" },
    category: "DEV",
    categoryColor: "#0891b2",
    date: "01 May 2026",
    likes: 204,
    comments: 38,
    status: "Published",
    featured: false,
  },
  {
    id: "3",
    title: "The Dark Side of Remote Work",
    excerpt: "An honest reflection on isolation, productivity, and burnout",
    author: { name: "Emma Williams", initials: "EW", role: "Content Creator", color: "#d946ef" },
    category: "LIFESTYLE",
    categoryColor: "#d946ef",
    date: "29 Apr 2026",
    likes: 88,
    comments: 91,
    status: "Flagged",
    featured: false,
  },
  {
    id: "4",
    title: "My Figma Workflow for Complex Design Systems",
    excerpt: "Breakdown of how I organize tokens, variants, and states",
    author: { name: "Noah Brown", initials: "NB", role: "UI Designer", color: "#ea580c" },
    category: "DESIGN",
    categoryColor: "#6366f1",
    date: "28 Apr 2026",
    likes: 0,
    comments: 0,
    status: "Draft",
    featured: false,
  },
  {
    id: "5",
    title: "Crypto Pumps and the Community Fallout",
    excerpt: "How speculative markets damage online communities",
    author: { name: "Ava Miller", initials: "AM", role: "Researcher", color: "#dc2626" },
    category: "FINANCE",
    categoryColor: "#f59e0b",
    date: "27 Apr 2026",
    likes: 56,
    comments: 120,
    status: "Flagged",
    featured: false,
  },
  {
    id: "6",
    title: "Mastering CSS Grid in 2026",
    excerpt: "Advanced layout techniques for modern web",
    author: { name: "Oliver Davis", initials: "OD", role: "Developer", color: "#16a34a" },
    category: "DEV",
    categoryColor: "#0891b2",
    date: "26 Apr 2026",
    likes: 178,
    comments: 29,
    status: "Published",
    featured: false,
  },
  {
    id: "7",
    title: "Spam: Free Crypto Airdrop Guide",
    excerpt: "Get free tokens NOW! Limited time offer!",
    author: { name: "James Hernandez", initials: "JH", role: "User", color: "#b91c1c" },
    category: "SPAM",
    categoryColor: "#ef4444",
    date: "25 Apr 2026",
    likes: 2,
    comments: 0,
    status: "Flagged",
    featured: false,
  },
  {
    id: "8",
    title: "The Rise of AI-Powered Design Tools",
    excerpt: "How AI is reshaping the creative workflow",
    author: { name: "Sophia Smith", initials: "SS", role: "Designer", color: "#6366f1" },
    category: "AI",
    categoryColor: "#8b5cf6",
    date: "24 Apr 2026",
    likes: 445,
    comments: 67,
    status: "Published",
    featured: true,
  },
  {
    id: "9",
    title: "Mental Health Tips for Developers",
    excerpt: "Taking care of yourself while coding 8+ hours a day",
    author: { name: "Emma Williams", initials: "EW", role: "Content Creator", color: "#d946ef" },
    category: "LIFESTYLE",
    categoryColor: "#d946ef",
    date: "23 Apr 2026",
    likes: 156,
    comments: 42,
    status: "Hidden",
    featured: false,
  },
  {
    id: "10",
    title: "Next.js 16 Deep Dive",
    excerpt: "Everything new in the latest Next.js release",
    author: { name: "Liam Johnson", initials: "LJ", role: "Developer", color: "#0891b2" },
    category: "DEV",
    categoryColor: "#0891b2",
    date: "22 Apr 2026",
    likes: 289,
    comments: 53,
    status: "Published",
    featured: false,
  },
];

// ============================================
// PRODUCTS
// ============================================
export const mockProducts: AdminProduct[] = [
  {
    id: "1",
    name: "Pro Dashboard UI Kit",
    seller: { name: "Sophia Smith", initials: "SS", color: "#6366f1" },
    price: 19,
    sales: 47,
    revenue: 893,
    status: "Active",
    category: "UI Kit",
  },
  {
    id: "2",
    name: "THALORIX Pro Plan",
    seller: { name: "Emma Williams", initials: "EW", color: "#d946ef" },
    price: 19,
    sales: 23,
    revenue: 437,
    status: "Active",
    category: "Subscription",
  },
  {
    id: "3",
    name: "React Component Library",
    seller: { name: "Liam Johnson", initials: "LJ", color: "#0891b2" },
    price: 29,
    sales: 15,
    revenue: 435,
    status: "Active",
    category: "Code",
  },
  {
    id: "4",
    name: "UX Research Masterclass",
    seller: { name: "Noah Brown", initials: "NB", color: "#ea580c" },
    price: 49,
    sales: 8,
    revenue: 392,
    status: "Active",
    category: "Course",
  },
  {
    id: "5",
    name: "Icon Pack Premium",
    seller: { name: "Oliver Davis", initials: "OD", color: "#16a34a" },
    price: 9,
    sales: 62,
    revenue: 558,
    status: "Suspended",
    category: "Assets",
  },
  {
    id: "6",
    name: "Freelancer Invoice Template",
    seller: { name: "Ava Miller", initials: "AM", color: "#dc2626" },
    price: 5,
    sales: 0,
    revenue: 0,
    status: "Active",
    category: "Template",
  },
];

// ============================================
// USERS (for permissions)
// ============================================
export const mockUsers: AdminUser[] = [
  {
    id: "1",
    name: "Sophia Smith",
    initials: "SS",
    role: "Designer",
    color: "#6366f1",
    isAdmin: false,
    permissions: { post: true, buy: true, templates: true, comment: true, message: true, admin: false },
  },
  {
    id: "2",
    name: "Liam Johnson",
    initials: "LJ",
    role: "Developer",
    color: "#0891b2",
    isAdmin: true,
    permissions: { post: true, buy: true, templates: true, comment: true, message: true, admin: true },
  },
  {
    id: "3",
    name: "Emma Williams",
    initials: "EW",
    role: "Content Creator",
    color: "#d946ef",
    isAdmin: false,
    permissions: { post: false, buy: true, templates: true, comment: false, message: true, admin: false },
  },
  {
    id: "4",
    name: "Noah Brown",
    initials: "NB",
    role: "UX Researcher",
    color: "#ea580c",
    isAdmin: false,
    permissions: { post: true, buy: false, templates: true, comment: true, message: true, admin: false },
  },
  {
    id: "5",
    name: "Olivia Jones",
    initials: "OJ",
    role: "Product Manager",
    color: "#16a34a",
    isAdmin: false,
    permissions: { post: true, buy: true, templates: false, comment: true, message: false, admin: false },
  },
  {
    id: "6",
    name: "James Hernandez",
    initials: "JH",
    role: "User",
    color: "#b91c1c",
    isAdmin: false,
    permissions: { post: false, buy: false, templates: false, comment: false, message: true, admin: false },
  },
  {
    id: "7",
    name: "Ava Miller",
    initials: "AM",
    role: "Researcher",
    color: "#dc2626",
    isAdmin: false,
    permissions: { post: true, buy: true, templates: true, comment: true, message: true, admin: false },
  },
  {
    id: "8",
    name: "Oliver Davis",
    initials: "OD",
    role: "Developer",
    color: "#0ea5e9",
    isAdmin: false,
    permissions: { post: true, buy: true, templates: false, comment: true, message: true, admin: false },
  },
];

// ============================================
// FLAGGED POSTS (Overview)
// ============================================
export const mockFlaggedPosts: FlaggedPost[] = [
  { id: "1", title: "The Dark Side of Remote Work", author: "Emma Williams", initials: "EW", color: "#d946ef" },
  { id: "2", title: "Crypto Pumps and the Community Fallout", author: "Ava Miller", initials: "AM", color: "#dc2626" },
  { id: "3", title: "Spam: Free Crypto Airdrop Guide", author: "James Hernandez", initials: "JH", color: "#b91c1c" },
];

// ============================================
// PENDING ORDERS (Overview)
// ============================================
export const mockPendingOrders: PendingOrder[] = [
  { id: "1", product: "THALORIX Pro Plan", buyer: "Emma Williams", price: "$19", initials: "EW", color: "#d946ef" },
  { id: "2", product: "THALORIX Pro Plan", buyer: "Lucas Taylor", price: "$19", initials: "LT", color: "#0891b2" },
];

// ============================================
// RESTRICTED USERS (Overview)
// ============================================
export const mockRestrictedUsers: RestrictedUser[] = [
  { id: "1", name: "Emma Williams", restrictions: ["No Post"], initials: "EW", color: "#d946ef" },
  { id: "2", name: "Noah Brown", restrictions: ["No Buy"], initials: "NB", color: "#ea580c" },
  { id: "3", name: "Ethan Garcia", restrictions: ["No Buy"], initials: "EG", color: "#16a34a" },
  { id: "4", name: "Ava Miller", restrictions: ["No Post", "No Buy"], initials: "AM", color: "#dc2626" },
];

// ============================================
// RECENT ACTIVITY (Overview)
// ============================================
export const mockRecentActivity: ActivityItem[] = [
  {
    id: "1",
    icon: "📝",
    iconColor: "#16a34a",
    iconBg: "#dcfce7",
    message: 'Sophia Smith published "Building Scalable Design Systems in 2026"',
    time: "2m ago",
  },
  {
    id: "2",
    icon: "🛒",
    iconColor: "#0891b2",
    iconBg: "#cffafe",
    message: "Sophia Smith purchased Pro Dashboard UI Kit",
    time: "15m ago",
  },
  {
    id: "3",
    icon: "🚩",
    iconColor: "#dc2626",
    iconBg: "#fee2e2",
    message: 'Post "The Dark Side of Remote Work" was flagged for review',
    time: "1h ago",
  },
  {
    id: "4",
    icon: "⭐",
    iconColor: "#f59e0b",
    iconBg: "#fef3c7",
    message: "Olivia Jones published a new featured post",
    time: "2h ago",
  },
  {
    id: "5",
    icon: "🔑",
    iconColor: "#6366f1",
    iconBg: "#e0e7ff",
    message: "User permissions updated for Ava Miller",
    time: "3h ago",
  },
  {
    id: "6",
    icon: "💰",
    iconColor: "#ea580c",
    iconBg: "#ffedd5",
    message: "Ethan Garcia requested refund on UX Research Masterclass",
    time: "5h ago",
  },
];
