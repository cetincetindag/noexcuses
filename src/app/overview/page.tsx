import { redirect } from "next/navigation";

export default function OverviewPageRedirect() {
  redirect("/dashboard/overview");
}
