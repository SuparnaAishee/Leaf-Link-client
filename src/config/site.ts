import {
  Home,
  Info,
  User,
  PlusSquare,
  Sparkles,
  Sprout,
  History,
  Bell,
  Calendar,
} from "lucide-react";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "LeafLink",
  description: "The social network for gardeners.",
  navItems: [
    { label: "Home", href: "/", icon: Home },
    { label: "About", href: "/about", icon: Info },
    { label: "Create Post", href: "/profile/create-post", icon: PlusSquare },
  ],
  navMenuItems: [
    { label: "Home", href: "/", icon: Home },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Events", href: "/events", icon: Calendar },
    { label: "Create Post", href: "/profile/create-post", icon: PlusSquare },
    { label: "AI Plant Doctor", href: "/ai-garden", icon: Sparkles },
    { label: "My Garden", href: "/my-garden", icon: Sprout },
    { label: "Scan history", href: "/ai-garden/history", icon: History },
    { label: "Profile", href: "/profile", icon: User },
    { label: "About", href: "/about", icon: Info },
  ],
};
