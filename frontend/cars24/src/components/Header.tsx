import React, { useState } from "react";
import {
  Car,
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
  // const user = {
  //   id: "1",
  //   avatar_url: "https://github.com/shadcn.png",
  //   email: "giris@gmail.com",
  //   full_name: "John Doe",
  //   phone: "+1234567890",
  //   created_at: new Date().toISOString(),
  // };
  const { user, signOut } = useAuth();
  const { items } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-3 sm:p-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex flex-1 lg:flex-none">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Cars24</span>
            <div className="flex items-center gap-1">
              <span className="bg-blue-600 text-white font-bold py-1 px-1.5 sm:px-2 rounded-md text-sm sm:text-lg">
                CARS
              </span>
              <span className="text-orange-500 font-bold text-sm sm:text-lg">24</span>
            </div>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 touch-manipulation"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open main menu"
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-6 xl:gap-x-8 flex-1 justify-center">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              <Link
                href={item.href}
                className="flex items-center text-xs sm:text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center space-x-2 sm:space-x-4">
          <div className="relative">
            <CitySelector />
          </div>
          <Link href="/wishlist" className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm text-gray-700 hover:text-blue-600 p-2 sm:p-2"
            >
              <Heart className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Wishlist</span>
              {items.length > 0 && (
                <span className="ml-1 sm:ml-2 rounded-full bg-blue-100 px-1.5 sm:px-2 text-xs text-blue-700">
                  {items.length}
                </span>
              )}
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="inline-flex items-center justify-center px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-orange-500 touch-manipulation"
              >
                {user ? (
                  <>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {user?.fullName ? (
                        <div className="w-full h-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs sm:text-sm font-medium uppercase">
                          {user.fullName.charAt(0)}
                        </div>
                      ) : (
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                      )}
                    </div>
                    <span className="hidden sm:inline ml-2">{user.fullName}</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Account</span>
                    <ChevronDown className="ml-0 sm:ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 sm:w-72">
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="w-full flex items-center gap-2 cursor-pointer py-2"
                    >
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
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/login"
                      className="w-full px-4 py-3 text-center text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
                    >
                      LOG&nbsp;IN / SIGN&nbsp;UP
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                </>
              )}

              {/* Common menu items */}
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
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div className="fixed inset-y-0 right-0 z-40 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Cars24</span>
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
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
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
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                <div className="py-6">
                  <Link
                    href="/wishlist"
                    className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
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
                      onClick={() => setMobileMenuOpen(false)}
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
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
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
                      onClick={() => setMobileMenuOpen(false)}
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
