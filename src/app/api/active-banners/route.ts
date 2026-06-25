import { NextResponse } from "next/server";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
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
    let activeBanners: any[] = [];
    const today = new Date();

    let firestoreError: string | null = null;
    // Query Firestore with a try-catch to handle permission issues gracefully
    try {
      const occasionsRef = collection(db, "occasions");
      const q = query(occasionsRef, where("bannerEnabled", "==", true));
      const snap = await getDocs(q);
      
      activeBanners = snap.docs
        .map((d) => d.data())
        .filter((occ: any) => {
          if (!occ.festivalDate) return false;
          
          const festDate = new Date(occ.festivalDate);
          const bufferDays = occ.preOrderDays || 7;
          
          const deadlineDate = new Date(festDate);
          deadlineDate.setDate(festDate.getDate() - bufferDays);

          // Active range: Today is before or equal to the deadline (FestivalDate - BufferDays)
          return today <= deadlineDate;
        });
    } catch (fsErr: any) {
      console.warn("Firestore fetch in active-banners failed", fsErr);
      firestoreError = fsErr?.message || String(fsErr);
    }

    // Fallback: If Firestore query fails or returns 0 active banners,
    // generate dynamic fallbacks for default festivals.
    if (activeBanners.length === 0) {
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

      // Filter default banners that are currently active:
      // Today is before or equal to (FestivalDate - 7 days)
      activeBanners = projected
        .filter(fest => {
          const bufferDays = 7;
          const deadlineDate = new Date(fest.occurrence);
          deadlineDate.setDate(fest.occurrence.getDate() - bufferDays);
          
          return today <= deadlineDate;
        })
        .map(fest => {
          const formattedDate = new Date(fest.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return {
            id: `default-${fest.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            label: fest.name,
            festivalDate: fest.date,
            bannerEnabled: true,
            bannerMessage: `${fest.name} is coming up on ${formattedDate}! Order your customized box today to receive it in time.`,
            preOrderDays: 7
          };
        });
    }

    // Sort by closest festival date
    activeBanners.sort((a: any, b: any) => new Date(a.festivalDate).getTime() - new Date(b.festivalDate).getTime());

    const response = NextResponse.json({ success: true, banners: activeBanners, firestoreError });
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET");
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
