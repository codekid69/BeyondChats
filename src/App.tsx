import { Routes, Route } from 'react-router'
import AppLayout from '@/layout/AppLayout'
import Dashboard from '@/pages/Dashboard'
import Chats from '@/pages/Chats'
import Integrations from '@/pages/Integrations'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="chats" element={<Chats />} />
        <Route path="integrations" element={<Integrations />} />
      </Route>
    </Routes>
  )
}
