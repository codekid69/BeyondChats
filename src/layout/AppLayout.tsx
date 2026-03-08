import { useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import Sidebar from './Sidebar'
import Header from './Header'

const routeConfig: Record<string, { title: string; description?: string }> = {
  '/': { title: 'Overview', description: 'Overview of your Gmail conversations' },
  '/chats': { title: 'Chats', description: 'Manage your email conversations' },
  '/integrations': { title: 'Integrations', description: 'Connect and manage your services' },
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const config = routeConfig[location.pathname] || { title: 'BeyondChats' }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:pl-64">
        <Header
          title={config.title}
          description={config.description}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
