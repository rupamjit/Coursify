import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import DataCard from "@/../components/customComponent/DataCard"
import Chart from "@/../components/customComponent/Chart"
import { getPerformance } from "../../../../actions/getPerformance"

const PerformancePage = async () => {
  const { userId } = await auth()

  if (!userId) {
    return redirect("/sign-in")
  }

  const { data, totalRevenue, totalSales } = await getPerformance(userId)

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard value={totalRevenue} label="Total Revenue" shouldFormat />
        <DataCard value={totalSales} label="Total Sales" />
        <Chart data={data} />
      </div>
    </div>
  )
}

export default PerformancePage