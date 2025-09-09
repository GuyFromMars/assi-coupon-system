// app/api/updatestudent/route.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export async function POST(req) {
  try {
    const { id, amount } = await req.json();

    //console.log(id, amount)

    if (!id || typeof amount !== "number") {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const studentRef = doc(db, "students", id);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      return new Response(JSON.stringify({ error: "Student not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const currentBalance = studentSnap.data().balance || 0;
    const newBalance = currentBalance + amount;

    await updateDoc(studentRef, { balance: newBalance });

    return new Response(
      JSON.stringify({ id, balance: newBalance }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating balance:", error);
    return new Response(JSON.stringify({ error: "Failed to update balance" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
