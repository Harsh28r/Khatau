import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import Badge from '../components/ui/Badge'
import { useAuth } from '../auth/AuthContext'

type Order = { _id: string; total: number; status: string; createdAt: string }

export default function Admin() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/orders', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      if (res.ok) setOrders(await res.json())
    }
    load()
  }, [])

  const totalRevenue = useMemo(() => orders.reduce((s, o) => s + (o.total || 0), 0), [orders])
  const pending = useMemo(() => orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length, [orders])

  return (
    <Container>
      <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>
      <nav className="mb-6 flex flex-wrap gap-2">
        <Link to="/admin/products" className="rounded border px-3 py-1 hover:bg-gray-50">Products</Link>
        <Link to="/admin/orders" className="rounded border px-3 py-1 hover:bg-gray-50">Orders</Link>
        <Link to="/admin/users" className="rounded border px-3 py-1 hover:bg-gray-50">Users</Link>
        <Link to="/admin/khata" className="rounded border-2 border-orange-500 bg-orange-50 px-3 py-1 font-semibold text-orange-600 hover:bg-orange-100">
          📒 Khata (उधार)
        </Link>
      </nav>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border p-5 shadow-sm">
          <div className="text-sm text-gray-600">Total orders</div>
          <div className="mt-1 text-3xl font-extrabold">{orders.length}</div>
          <div className="mt-2 text-xs text-gray-500">All-time</div>
        </div>
        <div className="rounded-2xl border p-5 shadow-sm">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="mt-1 text-3xl font-extrabold">{pending}</div>
          <div className="mt-2 text-xs text-gray-500">Awaiting fulfillment</div>
        </div>
        <div className="rounded-2xl border p-5 shadow-sm">
          <div className="text-sm text-gray-600">Revenue</div>
          <div className="mt-1 text-3xl font-extrabold">₹{totalRevenue}</div>
          <div className="mt-2 text-xs text-gray-500">Completed orders</div>
        </div>
      </div>

      <div className="rounded-xl border p-4 shadow-sm">
        <div className="mb-3 text-lg font-semibold">Recent orders</div>
        <div className="divide-y">
          {orders.slice(0, 8).map((o) => (
            <div key={o._id} className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">#{o._id.slice(-6)}</div>
                <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={o.status === 'completed' ? 'success' : o.status === 'cancelled' ? 'danger' : 'warning'}>
                  {o.status.replaceAll('_', ' ')}
                </Badge>
                <span className="font-semibold">₹{o.total}</span>
              </div>
            </div>
          ))}
          {orders.length === 0 && <div className="py-6 text-gray-600">No orders yet.</div>}
        </div>
      </div>
    </Container>
  )
}


