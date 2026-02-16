import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getWallet, redeemWallet, getRedemptions } from "@/services/userService";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/router";

interface Redemption {
  id: string;
  userId: string;
  pointsRedeemed: number;
  rewardType: string;
  redeemedAt: string;
  status: string;
}

const WalletPage = () => {
  const { user, setUser, refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [redeeming, setRedeeming] = useState<boolean>(false);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  const points = user?.walletPoints ?? 0;

  const loadWallet = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      await refreshUser(); // Refresh full user data from backend
      const data = await getWallet(user.id);
      if (data?.message) {
        toast.message(data.message);
      }
    } catch (err: any) {
      console.error("Failed to load wallet", err);
      toast.error("Failed to load wallet");
    } finally {
      setLoading(false);
    }
  };

  const loadRedemptions = async () => {
    if (!user?.id) return;
    try {
      const data = await getRedemptions(user.id);
      setRedemptions(data || []);
    } catch (err: any) {
      console.error("Failed to load redemptions", err);
    }
  };

  useEffect(() => {
    loadWallet();
    loadRedemptions();
  }, [user?.id]);

  const handleRedeem = async () => {
    if (!user?.id) return;
    setRedeeming(true);
    try {
      const res = await redeemWallet(user.id);
      if (res?.user) {
        setUser({
          ...user,
          walletPoints: res.user.walletPoints ?? 0,
        });
      }
      toast.success("Redeemed successfully");
      loadRedemptions(); // Refresh history
    } catch (err: any) {
      toast.error(err?.message || "Redeem failed");
    } finally {
      setRedeeming(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black bg-gray-50">
        <div className="bg-white p-6 rounded shadow text-center space-y-3">
          <p className="text-lg font-semibold">Please log in to view your wallet.</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Wallet</h1>
              <p className="text-sm text-gray-600">Redeem points for rewards (mock)</p>
            </div>
            <button
              onClick={loadWallet}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded p-4">
            <p className="text-sm text-blue-700">Wallet Points</p>
            <p className="text-3xl font-bold text-blue-800">{points}</p>
            <p className="text-xs text-blue-600 mt-1">Earn 1000 points for both you and your referrer when completing a booking or sale</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Redeem 500 points</p>
              <p className="text-sm text-gray-600">Get a discount voucher (Max 2000/booking)</p>
            </div>
            <button
              onClick={handleRedeem}
              disabled={redeeming || points < 500}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {redeeming ? "Redeeming..." : "Redeem"}
            </button>
          </div>
        </div>

        {/* Redemption History */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-bold">Transaction History</h2>
          {redemptions.length === 0 ? (
            <p className="text-gray-600 text-sm">No redemptions yet</p>
          ) : (
            <div className="space-y-2">
              {redemptions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{item.rewardType}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(item.redeemedAt).toLocaleDateString()} at{" "}
                      {new Date(item.redeemedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">-{item.pointsRedeemed} pts</p>
                    <p className="text-xs text-green-600">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WalletPage;
