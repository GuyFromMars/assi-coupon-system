import { db } from "@/lib/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "coupons"));
    const coupons = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify(coupons), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch coupons" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}