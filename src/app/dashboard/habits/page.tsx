import { redirect } from "next/navigation";

export default function HabitsPage() {
  redirect("/dashboard/habits/active");
}
