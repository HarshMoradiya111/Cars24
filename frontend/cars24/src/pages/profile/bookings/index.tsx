import { useEffect } from "react";
import { useRouter } from "next/router";

export default function BookingsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/bookings");
  }, [router]);

  return null;
}
