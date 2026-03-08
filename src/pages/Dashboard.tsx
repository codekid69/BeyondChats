import StatsCards from '@/components/dashboard/StatsCards'
import RecentThreads from '@/components/dashboard/RecentThreads'
import QuickActions from '@/components/dashboard/QuickActions'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentThreads />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
