import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import Badge from '../components/ui/Badge'
import { Link } from 'react-router-dom'
import { io } from 'socket.io-client'

type Order = {
  _id: string
  total: number
  status: string
  createdAt: string
  user?: { name: string; email: string; phone?: string } | null
  items?: { name: string; quantity: number; price: number; note?: string }[]
}

export default function AdminOrders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  async function load() {
    const res = await fetch('/api/admin/orders', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
    if (res.ok) setOrders(await res.json())
  }
  useEffect(() => {
    load()
    const socket = io('/', { path: '/socket.io' })
    socket.on('order:updated', () => load())
    socket.on('order:created', () => load())
    return () => { socket.close() }
  }, [])
  useEffect(() => {
    const id = setInterval(load, 10000)
    return () => clearInterval(id)
  }, [])

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/orders/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify({ status }) })
    if (res.ok) load()
  }

  const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled']

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold">Admin Orders</h2>
      {orders.map((o) => (
        <div key={o._id} className="rounded border p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">Order #{o._id.slice(-6)} • ₹{o.total}</div>
            <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
          </div>
          <div className="mt-1 text-sm text-gray-700">
            👤 {o.user?.name ?? '—'} {o.user?.phone ? `• 📞 ${o.user.phone}` : ''}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button key={s} onClick={() => updateStatus(o._id, s)} className={`rounded-full border px-3 py-1 text-sm capitalize ${o.status === s ? 'bg-red-600 text-white' : 'hover:bg-gray-50'}`}>{s.replaceAll('_',' ')}</button>
            ))}
            <div className="ml-auto">
              <Badge variant={o.status === 'completed' ? 'success' : o.status === 'cancelled' ? 'danger' : 'warning'}>{o.status.replaceAll('_',' ')}</Badge>
            </div>
            <Link to={`/admin/orders/${o._id}`} className="ml-2 text-sm text-red-600 hover:underline">View</Link>
          </div>
        </div>
      ))}
      {orders.length === 0 && <div className="text-gray-600">No orders.</div>}
    </div>
  )
}


