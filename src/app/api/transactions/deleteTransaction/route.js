import { db } from "@/lib/firebase/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { studentId, transactionId } = await req.json();

    if (!studentId || !transactionId) {
      return new Response(JSON.stringify({ error: "Missing IDs" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const studentRef = doc(db, "students", studentId);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      return new Response(JSON.stringify({ error: "Student not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const transactionRef = doc(db, "students", studentId, "transactions", transactionId);
    const txSnap = await getDoc(transactionRef);

    if (!txSnap.exists()) {
      return new Response(JSON.stringify({ error: "Transaction not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const txData = txSnap.data();
    const txAmount = txData.amount || 0;
    const newBalance = (studentSnap.data().balance || 0) + txAmount;

    // Delete transaction
    await deleteDoc(transactionRef);

    // Update student balance
    await updateDoc(studentRef, { balance: newBalance });

    return new Response(
      JSON.stringify({ success: true, newBalance }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return new Response(JSON.stringify({ error: "Failed to delete transaction" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
