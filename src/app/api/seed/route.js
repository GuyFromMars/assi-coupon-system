import { seedStudents, seedCoupons } from "@/scripts/seedStudents";

/* export async function GET() {
  await seedStudents();
  return new Response("Students seeded successfully", { status: 200 });
}
 */

export async function GET() {
  await seedCoupons();
  return new Response("Coupons seeded successfully", { status: 200 });
}