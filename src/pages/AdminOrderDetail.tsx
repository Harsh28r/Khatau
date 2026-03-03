import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Container from '../components/ui/Container'
import Badge from '../components/ui/Badge'

type Item = { name: string; price: number; quantity: number; note?: string }
type Order = {
  _id: string
  status: string
  total: number
  createdAt: string
  items: Item[]
  address?: string
  user?: { name: string; email: string; phone?: string } | null
}

export default function AdminOrderDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled']

  async function load() {
    const res = await fetch(`/api/admin/orders/${id}`, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
    if (res.ok) setOrder(await res.json())
  }
  useEffect(() => { load() }, [id])

  async function updateStatus(status: string) {
    const res = await fetch(`/api/admin/orders/${id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify({ status }) })
    if (res.ok) load()
  }

  if (!order) return <Container>Loading…</Container>
  return (
    <Container>
      <h2 className="mb-2 text-2xl font-bold">Order #{order._id.slice(-6)}</h2>
      <div className="mb-4 flex items-center gap-4">
        <Badge variant={order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}>{order.status.replaceAll('_', ' ')}</Badge>
        <div className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</div>
      </div>
      {(order.user || order.address) && (
        <div className="mb-4 rounded-xl border border-orange-100 bg-orange-50/50 p-4">
          <div className="mb-2 text-lg font-semibold">Customer & delivery</div>
          <div className="text-sm space-y-1">
            {order.user && (
              <>
                <div><span className="font-medium">Name:</span> {order.user.name}</div>
                <div><span className="font-medium">Phone:</span> {order.user.phone || '—'}</div>
                <div><span className="font-medium">Email:</span> {order.user.email}</div>
              </>
            )}
            {order.address && (
              <div><span className="font-medium">Address:</span> {order.address}</div>
            )}
          </div>
        </div>
      )}
      <div className="mb-4 rounded-xl border p-4 shadow-sm">
        <div className="mb-2 text-lg font-semibold">Items</div>
        <div className="divide-y">
          {order.items.map((it, idx) => (
            <div key={idx} className="py-2 text-sm">
              <div className="flex items-center justify-between">
                <span>{it.name} × {it.quantity}</span>
                <span>₹{it.price * it.quantity}</span>
              </div>
              {it.note && (
                <div className="mt-1 text-amber-800 text-xs italic">Note: {it.note}</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <div className="font-semibold">Total</div>
          <div className="font-bold">₹{order.total}</div>
        </div>
      </div>
      <div className="rounded-xl border p-4 shadow-sm">
        <div className="mb-2 text-lg font-semibold">Update status</div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button key={s} onClick={() => updateStatus(s)} className={`rounded-full border px-3 py-1 text-sm capitalize ${order.status === s ? 'bg-red-600 text-white' : 'hover:bg-gray-50'}`}>{s.replaceAll('_', ' ')}</button>
          ))}
        </div>
      </div>
    </Container>
  )
}


