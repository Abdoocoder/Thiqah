let analytics: any = null;
let ready = false;

export function initAnalytics() {
  if (ready) return;
  ready = true;

  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  if (!apiKey || !projectId) {
    console.warn("Firebase disabled — set VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID");
    return;
  }

  Promise.all([
    import("firebase/analytics"),
    import("firebase/app"),
  ]).then(([{ getAnalytics, logEvent }, { initializeApp }]) => {
    const app = initializeApp({
      apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    });
    analytics = getAnalytics(app);
  }).catch((e) => console.warn("Firebase init failed:", e));
}

export function trackPageView(path: string) {
  if (!analytics) return;
  import("firebase/analytics").then(({ logEvent }) => {
    logEvent(analytics, "page_view", { page_path: path });
  });
}

export { analytics };
