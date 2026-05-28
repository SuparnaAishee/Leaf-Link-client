"use client";

import { useState } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
import clsx from "clsx";

import { useUser } from "../context/user.provider";
import NavbarDropDown from "./UI/NavbarDropDown";
import { siteConfig } from "@/src/config/site";
import { ThemeSwitch } from "@/src/components/theme-switch";
import { useRouter } from "next/navigation";
import {
  UserIcon,
  Leaf,
  Search,
  Bell,
  MessageCircle,
  Home,
  Compass,
  PlusSquare,
  Heart,
  X,
  Sparkles,
} from "lucide-react";

export const Navbar = () => {
  const { user } = useUser();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const submitSearch = (q: string) => {
    const term = q.trim();
    if (!term) return;
    router.push(`/profile/searchUser?q=${encodeURIComponent(term)}`);
  };

  return (
    <NextUINavbar
      maxWidth="xl"
      position="sticky"
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm"
      height="4rem"
    >
      {/* Left Side - Logo */}
      <NavbarContent className="basis-1/5 sm:basis-1/4" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2 group" href="/">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-all duration-300 group-hover:scale-105">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hidden sm:block">
              LeafLink
            </span>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Center - Search Bar */}
      <NavbarContent className="hidden md:flex flex-1 max-w-md" justify="center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search gardeners, posts, tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch(searchQuery);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-300 text-gray-700 dark:text-gray-200 placeholder-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-gray-500" />
            </button>
          )}
        </div>
      </NavbarContent>

      {/* Right Side - Navigation Icons */}
      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-1/4 gap-1" justify="end">
        {/* Home */}
        <NavbarItem>
          <NextLink href="/" className="nav-icon nav-icon-active">
            <Home className="w-5 h-5" />
          </NextLink>
        </NavbarItem>

        {/* Explore */}
        <NavbarItem>
          <NextLink href="/profile/searchUser" className="nav-icon">
            <Compass className="w-5 h-5" />
          </NextLink>
        </NavbarItem>

        {/* AI Plant Doctor — 2026 feature */}
        <NavbarItem>
          <NextLink
            href="/ai-garden"
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-md shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.03] transition-all duration-300"
            aria-label="AI Plant Doctor"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden lg:inline">AI</span>
            <span className="absolute -top-1 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-900 shadow">
              NEW
            </span>
          </NextLink>
        </NavbarItem>

        {/* Create Post */}
        {user?.email && (
          <NavbarItem>
            <NextLink href="/profile/create-post" className="nav-icon">
              <PlusSquare className="w-5 h-5" />
            </NextLink>
          </NavbarItem>
        )}

        {/* Theme Switch */}
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>

        {/* User Profile / Login */}
        {user?.email ? (
          <NavbarItem>
            <NavbarDropDown />
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 font-medium text-sm"
            >
              <UserIcon className="w-4 h-4" />
              <span>Login</span>
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile - Search Icon & Menu Toggle */}
      <NavbarContent className="sm:hidden basis-1 pl-4 gap-2" justify="end">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="nav-icon"
        >
          <Search className="w-5 h-5" />
        </button>
        <ThemeSwitch />
        <NavbarMenuToggle className="text-green-600" />
      </NavbarContent>

      {/* Mobile Menu Content */}
      <NavbarMenu className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl pt-6">
        {/* Mobile Search */}
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="mx-4 mt-2 flex flex-col gap-1">
          {/* Quick Actions for Mobile */}
          {user?.email && (
            <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <NextLink href="/" className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
                <Home className="w-5 h-5 text-green-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Home</span>
              </NextLink>
              <NextLink href="/profile/searchUser" className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
                <Compass className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Explore</span>
              </NextLink>
              <NextLink href="/profile/create-post" className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
                <PlusSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Create</span>
              </NextLink>
              <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors relative">
                <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Activity</span>
                <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          )}

          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                  index === siteConfig.navMenuItems.length - 1
                    ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    : "text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600"
                )}
                href={item.href}
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>

        {/* Mobile Login Button */}
        {!user?.email && (
          <div className="px-4 mt-4">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-md font-medium"
            >
              <UserIcon className="w-4 h-4" />
              <span>Login to LeafLink</span>
            </Link>
          </div>
        )}
      </NavbarMenu>
    </NextUINavbar>
  );
};
