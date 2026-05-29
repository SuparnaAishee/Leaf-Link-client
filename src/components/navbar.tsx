"use client";

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

import { useUser } from "../context/user.provider";
import NavbarDropDown from "./UI/NavbarDropDown";
import NavSearch from "./UI/NavSearch";
import NotificationBell from "./UI/NotificationBell";
import { siteConfig } from "@/src/config/site";
import { ThemeSwitch } from "@/src/components/theme-switch";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/src/services/AuthService";
import { protectedRoutes } from "@/src/constant";
import {
  UserIcon,
  Leaf,
  Home,
  PlusSquare,
  Sparkles,
} from "lucide-react";

export const Navbar = () => {
  const { user, setIsLoading: userLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogOut = () => {
    logout();
    userLoading(true);
    if (protectedRoutes.some((route) => pathname.match(route))) {
      router.push("/");
    }
  };

  return (
    <NextUINavbar
      maxWidth="full"
      position="static"
      classNames={{
        base: "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm",
        wrapper: "max-w-screen-2xl mx-auto w-full px-4",
      }}
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
        <NavSearch placeholder="Search gardeners…" />
      </NavbarContent>

      {/* Right Side - Navigation Icons */}
      <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-1/4 gap-1" justify="end">
        {/* Home */}
        <NavbarItem>
          <NextLink href="/" className="nav-icon nav-icon-active">
            <Home className="w-5 h-5" />
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

        {/* Notifications */}
        {user?.email && (
          <NavbarItem>
            <NotificationBell />
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

      {/* Mobile - Theme & Menu Toggle */}
      <NavbarContent className="sm:hidden basis-1 pl-4 gap-2" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle className="text-green-600" />
      </NavbarContent>

      {/* Mobile Menu Content */}
      <NavbarMenu className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl pt-6">
        {/* Mobile Search */}
        <div className="px-4 mb-4">
          <NavSearch placeholder="Search gardeners…" variant="menu" />
        </div>

        <div className="mx-4 mt-2 flex flex-col gap-1">
          {/* Quick Actions for Mobile */}
          {user?.email && (
            <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <NextLink href="/" className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
                <Home className="w-5 h-5 text-green-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Home</span>
              </NextLink>
              <NextLink href="/profile/create-post" className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
                <PlusSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Create</span>
              </NextLink>
              <NextLink href="/ai-garden" className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors">
                <Sparkles className="w-5 h-5 text-green-600" />
                <span className="text-xs text-gray-600 dark:text-gray-400">AI</span>
              </NextLink>
            </div>
          )}

          {siteConfig.navMenuItems.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <NavbarMenuItem key={`${item.href}-${index}`}>
                <Link
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600"
                  href={item.href}
                  size="lg"
                >
                  {ItemIcon && <ItemIcon className="w-5 h-5 text-green-600" />}
                  {item.label}
                </Link>
              </NavbarMenuItem>
            );
          })}

          {user?.email && (
            <NavbarMenuItem>
              <button
                onClick={handleLogOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
              >
                Logout
              </button>
            </NavbarMenuItem>
          )}
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
