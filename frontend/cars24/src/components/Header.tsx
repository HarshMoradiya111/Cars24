import React, { useState } from "react";
import {
  Calendar,
  Package,
  FileText,
  HelpCircle,
  Users,
  Menu,
  Heart,
  User,
  ChevronDown,
  Bell,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import CitySelector from "./CitySelector";

const Header = () => {
  const navItems = [
    { name: "Buy used car", href: "/buy-car" },
    { name: "Sell car", href: "/sell-car" },
    { name: "Car finance", href: "/finance" },
    { name: "New cars", href: "/new-cars" },
    { name: "Car services", href: "/services" },
  ];

  const menuItems = [
    { label: "My Appointments", icon: Calendar, link: "/appointments" },
    { label: "My Bookings", icon: Package, link: "/bookings" },
    { label: "My Orders", icon: FileText, link: "/orders" },
    { label: "Resources", icon: FileText, link: "/resources" },
    { label: "RC Transfer Status", icon: FileText, link: "/rc-transfer" },
    { label: "Notification Settings", icon: Bell, link: "/notification-settings" },
    { label: "Become Our Partner", icon: Users, link: "/partner" },
    { label: "FAQ", icon: HelpCircle, link: "/faq" },
  ];

  const { user, signOut } = useAuth();
  const { items } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-3 sm:p-4 lg:px-8"
        aria-label="Global"
      >
        <Link href="/" className="-m-1.5 p-1.5">
          <div className="flex items-center gap-1">
            <span className="bg-blue-600 text-white font-bold py-1 px-1.5 sm:px-2 rounded-md text-sm sm:text-lg">
              CARS
            </span>
            <span className="text-orange-500 font-bold text-sm sm:text-lg">24</span>
          </div>
        </Link>

        <button
          type="button"
          className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="hidden lg:flex lg:gap-x-6 xl:gap-x-8 flex-1 justify-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-xs sm:text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center space-x-2 sm:space-x-4">
          <CitySelector />

          <Link href="/wishlist">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm text-gray-700 hover:text-blue-600 p-2 sm:p-2">
              <Heart className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Wishlist</span>
              {items.length > 0 && (
                <span className="ml-1 sm:ml-2 rounded-full bg-blue-100 px-1.5 sm:px-2 text-xs text-blue-700">
                  {items.length}
                </span>
              )}
            </Button>
          </Link>

          {!user && (
            <>
              <Link href="/signup">
                <Button 
                  variant="outline"
                  size="sm" 
                  className="text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 border-gray-300 hover:border-orange-500 hover:text-orange-500"
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  size="sm" 
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2"
                >
                  Sign In
                </Button>
              </Link>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="inline-flex items-center justify-center px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-orange-500">
                {user ? (
                  <>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-sm font-medium uppercase flex-shrink-0">
                      {user.fullName?.[0]}
                    </div>
                    <span className="hidden sm:inline ml-2">{user.fullName}</span>
                  </>
                ) : (
                  <>
                    <Menu className="h-5 w-5" />
                    <span className="hidden sm:inline ml-1">Menu</span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 sm:w-72">
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full cursor-pointer py-2">
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:bg-muted cursor-pointer py-2"
                    onClick={signOut}
                  >
                    Sign Out
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              ) : null}
              {menuItems.map(({ label, icon: Icon, link }) => (
                <DropdownMenuItem asChild key={label}>
                  <Link href={link} className="flex items-center gap-3 w-full cursor-pointer py-2">
                    <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 z-40 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <div className="flex items-center gap-1">
                  <span className="bg-blue-600 text-white font-bold py-1 px-1.5 rounded-md text-sm">
                    CARS
                  </span>
                  <span className="text-orange-500 font-bold text-sm">24</span>
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={closeMobile}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="py-6">
                  <div className="px-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Location
                    </p>
                    <CitySelector />
                  </div>
                </div>

                <div className="space-y-2 py-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-blue-50 hover:text-blue-600"
                      onClick={closeMobile}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="py-6">
                  <Link
                    href="/wishlist"
                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-blue-50 hover:text-blue-600"
                    onClick={closeMobile}
                  >
                    Wishlist {items.length > 0 && `(${items.length})`}
                  </Link>
                </div>

                <div className="py-6 space-y-2">
                  {menuItems.map(({ label, icon: Icon, link }) => (
                    <Link
                      key={label}
                      href={link}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-blue-50 hover:text-blue-600"
                      onClick={closeMobile}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>

                {user ? (
                  <div className="py-6 space-y-2">
                    <Link
                      href="/profile"
                      className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-blue-50 hover:text-blue-600"
                      onClick={closeMobile}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        closeMobile();
                      }}
                      className="block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="py-6">
                    <Link
                      href="/login"
                      className="block rounded-lg px-4 py-2.5 text-center text-sm font-semibold leading-6 text-white bg-orange-500 hover:bg-orange-600"
                      onClick={closeMobile}
                    >
                      LOG IN / SIGN UP
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
