import { db } from "@/lib/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { id, name, couponcode } = await req.json();
    const studentRef = doc(db, "students", id);

    await updateDoc(studentRef, {
      name,
      couponcode,
    });

    return new Response(
      JSON.stringify({ id, name, couponcode }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error editing student:", error);
    return new Response(
      JSON.stringify({ error: "Failed to edit student" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
