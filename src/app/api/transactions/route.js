import { db } from "@/lib/firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";

// Helper to check if a timestamp is today
function isToday(timestamp) {
  const date = timestamp.toDate ? timestamp.toDate() : timestamp;
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// GET /api/transactions?coupon=CODE
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const couponCode = searchParams.get("coupon");

    if (!couponCode) {
      return new Response(
        JSON.stringify({ error: "Coupon code is required" }),
        { status: 400 }
      );
    }

    // Fetch coupon info from the coupons collection
    const couponQuery = query(collection(db, "coupons"), where("codename", "==", couponCode));
    const couponSnapshot = await getDocs(couponQuery);
    if (couponSnapshot.empty) {
      return new Response(
        JSON.stringify({ error: "Coupon not found" }),
        { status: 404 }
      );
    }
    const couponData = couponSnapshot.docs[0].data();
    const couponAmount = couponData.amount || 0;

    // Query students with this coupon
    const studentQuery = query(collection(db, "students"), where("couponcode", "==", couponCode));
    const studentSnapshot = await getDocs(studentQuery);

    const students = [];
    for (const docSnap of studentSnapshot.docs) {
      const studentData = docSnap.data();
      const studentId = docSnap.id;

      // Count transactions for today
      const txSnapshot = await getDocs(collection(db, "students", studentId, "transactions"));
      const timesToday = txSnapshot.docs.filter((txDoc) =>
        isToday(txDoc.data().timestamp)
      ).length;

      students.push({
        id: studentId,
        ...studentData,
        times: timesToday,
      });
    }

    return new Response(
      JSON.stringify({ students, coupon: { codename: couponCode, amount: couponAmount } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching students:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch students" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


// POST /api/transactions
export async function POST(req) {
  try {
    const body = await req.json();
    const { students, coupon } = body;

    if (!students || !coupon) {
      return new Response(
        JSON.stringify({ error: "Students and coupon are required" }),
        { status: 400 }
      );
    }
    // Fetch coupon value from the coupons collection
    const couponQuery = query(collection(db, "coupons"), where("codename", "==", coupon.codename));
    const couponSnapshot = await getDocs(couponQuery);
    if (couponSnapshot.empty) {
      return new Response(
        JSON.stringify({ error: "Coupon not found" }),
        { status: 404 }
      );
    }
    const couponData = couponSnapshot.docs[0].data();
    const couponValue = couponData.amount || 0;

    const updatedIds = [];

    for (const student of students) {
      const studentRef = doc(db, "students", student.id);
      const currentBalance = student.balance || 0;
      const remainingBalance = currentBalance - couponValue;

      // Add transaction to subcollection
      await addDoc(collection(studentRef, "transactions"), {
        timestamp: Timestamp.fromDate(new Date()),
        amount: couponValue,
        remainingBalance,
      });

      // Update student balance
      await updateDoc(studentRef, { balance: remainingBalance });

      updatedIds.push(student.id);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Transactions processed", updatedIds, couponValue }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error saving transactions:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process transactions" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

