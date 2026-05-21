import { Heart, MessageCircle, Award, Bookmark } from "lucide-react";

export const EXPERTISE = [
  { name: "React / Next.js", percent: 96 },
  { name: "Node.js / Express", percent: 92 },
  { name: "TypeScript", percent: 88 },
  { name: "Cloud (AWS/GCP)", percent: 80 },
  { name: "Python / Django", percent: 75 },
];

export const EXPERIENCE = [
  { initials: "TT", color: "#103B40", role: "Senior Full Stack Developer", company: "Thalorix Technologies", dates: "2023 – Present" },
  { initials: "DS", color: "#2563eb", role: "Full Stack Developer", company: "DevStream Inc.", dates: "2020 – 2022" },
  { initials: "PF", color: "#7c3aed", role: "Frontend Developer", company: "PixelForge Labs", dates: "2018 – 2020" },
];

export const CERTIFICATIONS = [
  { icon: "🏅", name: "AWS Solutions Architect", org: "Amazon · 2023" },
  { icon: "☁️", name: "Google Cloud Professional", org: "Google · 2022" },
  { icon: "⚛️", name: "Meta React Developer", org: "Meta · 2022" },
];

export const EDUCATION = [
  { icon: "🎓", degree: "B.Sc Computer Science", school: "University of Lagos", dates: "2014 – 2018" },
];

export const LIVE_ACTIVITY = [
  { icon: Heart, color: "text-pink-500", text: "Maher liked your post", time: "3h ago" },
  { icon: MessageCircle, color: "text-blue-500", text: "Alex commented on your article", time: "14m ago" },
  { icon: Award, color: "text-amber-500", text: "You hit 1,400 connections!", time: "1h ago" },
  { icon: Bookmark, color: "text-teal-500", text: "Priya shared your post", time: "3h ago" },
];

export const PROFILE_INSIGHTS = [
  { label: "Profile views", value: "2,347", change: "+12%", positive: true },
  { label: "Post impressions", value: "18.4k", change: "+28%", positive: true },
  { label: "Search appearances", value: "321", change: "-4%", positive: false },
];

export const NETWORK_SUGGESTIONS = [
  { initials: "AJ", color: "#2563eb", name: "Alex Johnson", title: "UX Designer · 12 m" },
  { initials: "PS", color: "#7c3aed", name: "Priya Sharma", title: "Product Manager · 8 m" },
  { initials: "KC", color: "#dc2626", name: "Kevin Choi", title: "DevOps Engineer · 5 m" },
  { initials: "LF", color: "#059669", name: "Lena Fischer", title: "AI Researcher · 14 m" },
];

export const TRENDING = [
  { tag: "#OpenSource", posts: "2.7k posts" },
  { tag: "#ReactJS", posts: "1.3k posts" },
  { tag: "#AITools", posts: "4.1k posts" },
  { tag: "#WebDev", posts: "3.2k posts" },
  { tag: "#NodeJS", posts: "987 posts" },
];
