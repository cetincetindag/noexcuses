import { auth, currentUser } from '@clerk/nextjs/server';
import { OverallProgressGraph } from '~/components/dashboard/overview/overall-progress-graph';
import { userService } from '~/services/user';

const Page = async () => {
  const { userId, redirectToSignIn } = await auth();
  const userClerk = await currentUser();

  if (!userId) return redirectToSignIn();

  const username = userService.returnUsername(userId)

  return (
    <div>
      Hello, {username}
      <OverallProgressGraph />
    </div>
  )
}

export default Page;
