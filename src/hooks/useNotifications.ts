import { useState, useEffect } from "react";
import { apiClient } from "@/src/lib/api";
import { toast } from "sonner";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BOottcy0JB8QVW9MLyWVxL3USpm53pWPi9I8j2exuuJ-qf_DP1JAyVfAK1XOC26RxwwjVAZHkyxth1B6dvEcNBo";

export function useNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      // Register Service Worker
      navigator.serviceWorker.register("/sw.js").then(
        (reg) => {
          console.log("Service Worker registered", reg);
          setRegistration(reg);
          reg.pushManager.getSubscription().then((sub) => {
            if (sub) {
              setSubscription(sub);
              setIsSubscribed(true);
            }
          });
        },
        (err) => {
          console.error("Service Worker registration failed", err);
        }
      );
    }
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribe = async () => {
    if (!registration) {
      toast.error("Notifications not supported or blocked");
      return;
    }

    try {
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      setSubscription(sub);
      setIsSubscribed(true);

      // Send subscription to backend
      await apiClient.post("/notifications/subscribe", {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.toJSON().keys?.p256dh,
          auth: sub.toJSON().keys?.auth,
        },
      });

      toast.success("Notifications enabled!");
    } catch (error) {
      console.error("Failed to subscribe", error);
      toast.error("Failed to enable notifications");
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return;

    try {
      await subscription.unsubscribe();
      setIsSubscribed(false);
      setSubscription(null);
      // Optional: Notify backend to remove subscription
      toast.success("Notifications disabled");
    } catch (error) {
      console.error("Error unsubscribing", error);
    }
  };

  return { isSubscribed, subscribe, unsubscribe };
}
