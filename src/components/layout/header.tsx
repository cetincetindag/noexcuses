import { Button } from "~/components/ui/button"
import { Settings, User } from "lucide-react"
/* 
  import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton
} from "@clerk/nextjs"
*/

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <h1 className="text-2xl font-sans">
        <span className="text-gray-500">no</span>
        <span className="text-white">excuses</span>
      </h1>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
          <span className="sr-only">Settings</span>
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5" />
          <span className="sr-only">User</span>
        </Button>
      </div>
    </header>
  )
}
