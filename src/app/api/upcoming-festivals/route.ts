import { NextResponse } from "next/server";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timeMax = new Date(today);
    timeMax.setDate(today.getDate() + 60);

    let upcomingFestivals: any[] = [];

    // Query Firestore with a try-catch to handle permission issues gracefully
    try {
      const occasionsRef = collection(db, "occasions");
      const snap = await getDocs(occasionsRef);

      upcomingFestivals = snap.docs
        .map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.label,
            date: data.festivalDate,
            category: data.category,
            bannerEnabled: data.bannerEnabled,
            bannerImg: data.bannerImg || null
          };
        })
        .filter((occ: any) => {
          if (!occ.date || occ.category !== "festivals") return false;
          
          const festDate = new Date(occ.date);
          // Upcoming in the next 60 days
          return festDate >= today && festDate <= timeMax;
        })
        .map((occ: any) => ({
          id: occ.id,
          name: occ.name,
          date: occ.date,
          bannerImg: occ.bannerImg,
          source: 'manual'
        }));
    } catch (fsErr) {
      console.warn("Firestore fetch in upcoming-festivals failed, falling back to defaults", fsErr);
    }

    // Fallback: If no custom festivals are scheduled in the next 60 days or database fetch fails,
    // generate the next 3 upcoming default festivals relative to today.
    if (upcomingFestivals.length === 0) {
      const defaultFestList = [
        { name: "New Year's Day", month: 0, day: 1 },
        { name: "Republic Day", month: 0, day: 26 },
        { name: "Holi", month: 2, day: 14 },
        { name: "Eid al-Fitr", month: 2, day: 31 },
        { name: "Independence Day", month: 7, day: 15 },
        { name: "Gandhi Jayanti", month: 9, day: 2 },
        { name: "Diwali", month: 10, day: 4 },
        { name: "Christmas", month: 11, day: 25 }
      ];

      const projected = defaultFestList.map(fest => {
        const year = today.getFullYear();
        let occurrence = new Date(year, fest.month, fest.day);
        if (occurrence < today) {
          occurrence = new Date(year + 1, fest.month, fest.day);
        }
        return {
          name: fest.name,
          date: occurrence.toISOString().split('T')[0],
          occurrence
        };
      });

      // Sort by closest date
      projected.sort((a, b) => a.occurrence.getTime() - b.occurrence.getTime());

      // Take closest 3
      upcomingFestivals = projected.slice(0, 3).map(fest => ({
        id: `default-${fest.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: fest.name,
        date: fest.date,
        source: 'default'
      }));
    }

    // Sort by date ascending
    upcomingFestivals.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return NextResponse.json({ success: true, festivals: upcomingFestivals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
