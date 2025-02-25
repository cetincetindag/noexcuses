import { renderHabit } from "~/components/renderHabit";
import { db } from "~/server/db";

const Page = async () => {
  const testUserID = "cm79fha4n0004uoq6qkvw3wp2"
  const data = await db.user.findUnique({
    where: {
      id: testUserID
    },
    select: {
      habits: true
    }
  })

  console.log(data)
  console.log(data?.habits)

  return (
    <div>
      {data && renderHabit(data?.habits)}
    </div>
  )
}


export default Page;
