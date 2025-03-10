import { redirect } from "next/navigation";
import { userService } from "~/services/user";
import HomePage from "~/components/landing-page";

export default async function Home() {
  const user = await userService.getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }
  return <HomePage />;
}
