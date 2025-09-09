import { db } from "@/lib/firebase/firebase";
import { collection, addDoc } from "firebase/firestore";


{/* seed students*/}
const students = [
  { name: "Yaw Mensah", balance: 120, couponcode: "assicat2" },
  { name: "Ama Serwaa", balance: 340, couponcode: "assicat3" },
  { name: "Kojo Owusu", balance: 500, couponcode: "assicat1" },
  { name: "Esi Agyeman", balance: 80, couponcode: "assicat2" },
  { name: "Kwame Ofori", balance: 220, couponcode: "assicat3" },
  { name: "Abena Boateng", balance: 95, couponcode: "assicat1" },
  { name: "Kwesi Darko", balance: 60, couponcode: "assicat2" },
  { name: "Akosua Frimpong", balance: 410, couponcode: "assicat3" },
  { name: "Kojo Boadu", balance: 75, couponcode: "assicat1" },
  { name: "Efua Appiah", balance: 130, couponcode: "assicat2" },
  { name: "Kofi Antwi", balance: 290, couponcode: "assicat3" },
  { name: "Adwoa Owusu", balance: 55, couponcode: "assicat1" },
  { name: "Nana Yeboah", balance: 360, couponcode: "assicat2" },
  { name: "Abigail Tetteh", balance: 180, couponcode: "assicat3" },
];

export async function seedStudents() {
  try {
    const colRef = collection(db, "students");

    for (const student of students) {
      await addDoc(colRef, student);
      console.log(`✅ Added ${student.name}`);
    }

    console.log("🎉 Seeding complete!");
  } catch (err) {
    console.error("❌ Error seeding students:", err);
  }
}


{/* seed coupons*/}
const coupons = [
  { codename: "assicat1", amount: 7 },
  { codename: "assicat2", amount: 10 },
  { codename: "assicat3", amount: 15 },
  { codename: "assicat4", amount: 22 },
];


export async function seedCoupons() {
  try {
    const colRef = collection(db, "coupons");

    for (const coupon of coupons) {
      await addDoc(colRef, coupon);
      console.log(`✅ Added ${coupon.codename}`);
    }

    console.log("🎉 Seeding complete!");
  } catch (err) {
    console.error("❌ Error seeding coupons:", err);
  }
}
