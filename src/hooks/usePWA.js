import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api.js";
import { useAuth } from "./useAuth.jsx";

const SETTINGS_PWA_KEY = "sinau_pwa_settings";

export function usePWA() {
  const { isAuthenticated } = useAuth();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swRegistration, setSwRegistration] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "unsupported";
  });

  const [reminderConfig, setReminderConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_PWA_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      enabled: false,
      morningHour: "08:00",
      eveningHour: "19:00"
    };
  });

  // 1. Register Service Worker on Mount
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Detect standalone display mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsInstalled(isStandalone);

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        setSwRegistration(reg);
      })
      .catch((err) => {
        console.warn("[PWA] Service Worker gagal didaftarkan:", err);
      });

    // 2. Capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // 3. Prompt PWA Installation
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setCanInstall(false);

    if (outcome === "accepted") {
      setIsInstalled(true);
      return true;
    }
    return false;
  }, [deferredPrompt]);

  // 4. Request Notification Permission
  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Browser ini belum mendukung fitur Web Notification.");
      return "unsupported";
    }

    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);

      if (perm === "granted") {
        setReminderConfig((prev) => {
          const next = { ...prev, enabled: true };
          localStorage.setItem(SETTINGS_PWA_KEY, JSON.stringify(next));
          return next;
        });

        if (isAuthenticated) {
          api.updateSettings({
            notifications_enabled: true,
            reminder_morning: reminderConfig.morningHour,
            reminder_evening: reminderConfig.eveningHour
          }).catch(() => {});
        }
      }

      return perm;
    } catch (err) {
      console.warn("[PWA] Gagal meminta izin notifikasi:", err);
      return "denied";
    }
  }, [isAuthenticated, reminderConfig]);

  // 5. Send Immediate Test Notification
  const sendTestNotification = useCallback(({ title, body, url = "/belajar/missions" } = {}) => {
    if (notificationPermission !== "granted") {
      alert("Silakan izinkan notifikasi terlebih dahulu.");
      return;
    }

    const notifTitle = title || "Pengingat Misi SinauEnglish";
    const notifBody = body || "3 misi harian menunggumu di SinauEnglish! Jaga streak belajarmu hari ini.";

    if (swRegistration && "showNotification" in swRegistration) {
      swRegistration.showNotification(notifTitle, {
        body: notifBody,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/favicon.svg",
        data: { url },
        tag: "sinau-mission-test"
      });
    } else if ("Notification" in window) {
      new Notification(notifTitle, {
        body: notifBody,
        icon: "/icons/icon-192x192.png"
      });
    }
  }, [notificationPermission, swRegistration]);

  // 6. Update Reminder Config
  const updateReminderConfig = useCallback((newConfig) => {
    setReminderConfig((prev) => {
      const next = { ...prev, ...newConfig };
      localStorage.setItem(SETTINGS_PWA_KEY, JSON.stringify(next));
      return next;
    });

    if (isAuthenticated) {
      api.updateSettings({
        notifications_enabled: newConfig.enabled !== undefined ? newConfig.enabled : reminderConfig.enabled,
        reminder_morning: newConfig.morningHour || reminderConfig.morningHour,
        reminder_evening: newConfig.eveningHour || reminderConfig.eveningHour
      }).catch(() => {});
    }
  }, [isAuthenticated, reminderConfig]);

  return {
    canInstall,
    isInstalled,
    notificationPermission,
    reminderConfig,
    promptInstall,
    requestNotificationPermission,
    sendTestNotification,
    updateReminderConfig
  };
}
