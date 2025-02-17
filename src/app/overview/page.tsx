import { auth, currentUser } from '@clerk/nextjs/server';
import { userService } from '~/services/user';

const Page = async () => {
  const { userId, redirectToSignIn } = await auth();
  const userClerk = await currentUser();

  if (!userId) return redirectToSignIn();

  const username = userService.returnUsername(userId)



  return (
    <div>
      Hello, {username}
    </div>
  )
}

export default Page;
