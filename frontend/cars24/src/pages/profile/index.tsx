import { Bell, Calendar, Car, LogOut, Mail, Settings, User, Copy, Share2 } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const index = () => {
  const { user, signOut } = useAuth();
  const [copying, setCopying] = useState(false);
  
  // Log user data for debugging
  React.useEffect(() => {
    console.log("Profile page - Current user:", user);
  }, [user]);

  const safeUser = user || {
    id: "fallback",
    email: "user@example.com",
    fullName: "User",
    phone: "",
    referralCode: "",
    walletPoints: 0,
  } as any;
  const router = useRouter();

  const getReferralLink = () => {
    const code = safeUser?.referralCode || "";
    if (!code) return "";
    
    // Use environment variable for production safety
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
    if (!baseUrl) return "";
    
    return `${baseUrl}/signup?ref=${code}`;
  };

  const handleCopyReferralCode = () => {
    if (!safeUser?.referralCode) {
      toast.error("No referral code available");
      return;
    }
    try {
      // Try modern API first
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(safeUser.referralCode).then(() => {
          toast.success("Referral code copied!");
        }).catch(() => {
          fallbackCopy(safeUser.referralCode);
        });
      } else {
        fallbackCopy(safeUser.referralCode);
      }
    } catch (err) {
      toast.error("Copy not supported");
    }
  };

  const handleCopyReferralLink = async () => {
    const link = getReferralLink();
    if (!link) {
      toast.error("Referral link not available");
      return;
    }
    setCopying(true);
    try {
      // Try modern API first
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(link);
          toast.success("Referral link copied!");
          setCopying(false);
          return;
        } catch (clipboardErr: any) {
          console.warn("Clipboard API blocked, using fallback:", clipboardErr.message);
          fallbackCopy(link);
          setCopying(false);
          return;
        }
      } else {
        fallbackCopy(link);
        setCopying(false);
      }
    } catch (err: any) {
      console.error("Copy error:", err);
      fallbackCopy(link);
      setCopying(false);
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success("Link copied!");
    } catch (err) {
      console.error("Fallback copy failed:", err);
      toast.error("Failed to copy. Please copy manually.");
    }
  };

  const handleShareReferralLink = async () => {
    const link = getReferralLink();
    if (!link) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Cars24",
          text: "Sign up using my referral link and earn rewards!",
          url: link,
        });
        toast.success("Shared successfully!");
      } catch (err: any) {
        if (err.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      handleCopyReferralLink();
    }
  };

  return (
     <div className="min-h-screen bg-gray-50 text-black">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-blue-600 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {safeUser?.fullName || safeUser?.full_name}
                  </h1>
                  <p className="text-blue-100">{safeUser?.email}</p>
                  {safeUser?.referralCode && (
                    <p className="text-blue-100 text-sm mt-1">Referral: {safeUser.referralCode}</p>
                  )}
                  <p className="text-blue-100 text-sm">Wallet Points: {safeUser?.walletPoints ?? 0}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Profile Information */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">
                        Profile Information
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium">{safeUser?.fullName || safeUser?.full_name}</span>
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
                          {/* Referral Code */}
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Your Referral Code</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={safeUser?.referralCode || ""}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50"
                              />
                              <button
                                onClick={handleCopyReferralCode}
                                disabled={!safeUser?.referralCode}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
                                title="Copy code"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Referral Link */}
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Your Referral Link</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={getReferralLink()}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm break-all"
                              />
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={handleCopyReferralLink}
                                disabled={!safeUser?.referralCode || copying}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                              >
                                <Copy className="w-4 h-4" />
                                {copying ? "Copying..." : "Copy Link"}
                              </button>
                              <button
                                onClick={handleShareReferralLink}
                                disabled={!safeUser?.referralCode}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                              >
                                <Share2 className="w-4 h-4" />
                                Share
                              </button>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-700">
                            Share your referral link and earn 100 points for each friend who signs up!
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
                      onClick={() => alert('Account Settings\n\nManage your account preferences:\n\n• Change password\n• Email notifications\n• Privacy settings\n• Two-factor authentication\n• Connected devices\n\nThis feature will be available soon!')}
                      className="w-full flex items-center space-x-2 p-3 text-left rounded-lg hover:bg-gray-50"
                    >
                      <Settings className="w-5 h-5 text-gray-400" />
                      <span>Account Settings</span>
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
                      onClick={async () => { await signOut(); router.push("/"); }}
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

export default index;
