import { redirect } from "next/navigation";
import { User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function ProfilePage() {
  redirect("/dashboard/profile/account");
}
