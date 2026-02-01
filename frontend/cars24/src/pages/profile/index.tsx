import { Bell, Calendar, Car, LogOut, Mail, Settings, User, Copy, Share2 } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { getUserById } from "@/services/userService";

const ProfilePage = () => {
  const { user, setUser, signOut, refreshUser } = useAuth();
  const [copying, setCopying] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
      refreshUser();
    }
  }, [user?.id]);

  const safeUser = user || {
    id: "fallback",
    email: "user@example.com",
    fullName: "User",
    phone: "",
    referralCode: "",
    walletPoints: 0,
  };

  const referralLink = safeUser?.referralCode
    ? `${process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "")}/signup?ref=${safeUser.referralCode}`
    : "";

  const copyToClipboard = async (text: string) => {
    if (!text) {
      toast.error("Nothing to copy");
      return;
    }
    setCopying(true);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        toast.success("Copied!");
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        toast.success("Copied!");
      }
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Failed to copy");
    } finally {
      setCopying(false);
    }
  };

  const handleShare = async () => {
    if (!referralLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Cars24",
          text: "Sign up using my referral link and earn rewards!",
          url: referralLink,
        });
        toast.success("Shared!");
      } catch (err: any) {
        if (err.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      copyToClipboard(referralLink);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{safeUser?.fullName}</h1>
                  <p className="text-blue-100">{safeUser?.email}</p>
                  {safeUser?.referralCode && (
                    <p className="text-blue-100 text-sm mt-1">Code: {safeUser.referralCode}</p>
                  )}
                  <p className="text-blue-100 text-sm">Points: {safeUser?.walletPoints ?? 0}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Profile Info */}
                <div className="md:col-span-2">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium">{safeUser?.fullName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{safeUser?.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Bell className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{safeUser?.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Wallet Points:</span>
                        <span className="font-medium">{safeUser?.walletPoints ?? 0}</span>
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-semibold mb-3">Referral Program</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Your Code</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={safeUser?.referralCode || ""}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50"
                              />
                              <button
                                onClick={() => copyToClipboard(safeUser?.referralCode || "")}
                                disabled={!safeUser?.referralCode}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
                                title="Copy code"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Your Link</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={referralLink}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm break-all"
                              />
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => copyToClipboard(referralLink)}
                                disabled={!safeUser?.referralCode || copying}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                              >
                                <Copy className="w-4 h-4" />
                                {copying ? "Copying..." : "Copy"}
                              </button>
                              <button
                                onClick={handleShare}
                                disabled={!safeUser?.referralCode}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                              >
                                <Share2 className="w-4 h-4" />
                                Share
                              </button>
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-700">
                            Share your link and earn 100 points for each friend who signs up!
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Quick Actions</h2>
                  <div className="space-y-2">
                    <button
                      onClick={() => router.push("/profile/wallet")}
                      className="w-full flex items-center space-x-2 p-3 text-left rounded-lg hover:bg-gray-50"
                    >
                      <User className="w-5 h-5 text-gray-400" />
                      <span>Wallet</span>
                    </button>

                    <button
                      onClick={() => toast.info("Settings coming soon")}
                      className="w-full flex items-center space-x-2 p-3 text-left rounded-lg hover:bg-gray-50"
                    >
                      <Settings className="w-5 h-5 text-gray-400" />
                      <span>Settings</span>
                    </button>

                    <button
                      onClick={() => router.push("/bookings")}
                      className="w-full flex items-center space-x-2 p-3 text-left rounded-lg hover:bg-gray-50"
                    >
                      <Car className="w-5 h-5 text-gray-400" />
                      <span>My Cars</span>
                    </button>

                    <button
                      onClick={() => router.push("/appointments")}
                      className="w-full flex items-center space-x-2 p-3 text-left rounded-lg hover:bg-gray-50"
                    >
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span>Appointments</span>
                    </button>

                    <button
                      onClick={async () => {
                        await signOut();
                        router.push("/");
                      }}
                      className="w-full flex items-center space-x-2 p-3 text-left rounded-lg hover:bg-gray-50 text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
