import { db } from "@/lib/firebase/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return new Response(JSON.stringify({ error: "Student ID required" }), { status: 400 });
    }

    // Fetch student document
    const studentRef = doc(db, "students", id);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      return new Response(JSON.stringify({ error: "Student not found" }), { status: 404 });
    }

    const studentData = studentSnap.data();

    // Fetch transactions subcollection
    const transactionsRef = collection(db, "students", id, "transactions");
    const txSnapshot = await getDocs(transactionsRef);

    const transactions = txSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return new Response(JSON.stringify({ student: studentData, transactions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching student info:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch student info" }), { status: 500 });
  }
}
