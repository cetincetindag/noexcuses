import { redirect } from "next/navigation";

export default function TasksPage() {
  redirect("/dashboard/tasks/today");
}
