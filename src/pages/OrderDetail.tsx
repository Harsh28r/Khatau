import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

type Order = { _id: string; total: number; status: string; createdAt: string; items: { name: string; price: number; quantity: number }[] }

export default function OrderDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)

  async function load() {
    const res = await fetch(`/api/orders/${id}`, { headers: { Authorization: token ? `Bearer ${token}` : '' } })
    if (res.ok) setOrder(await res.json())
  }

  useEffect(() => {
    load()
    const timer = setInterval(load, 5000)
    return () => clearInterval(timer)
  }, [id])

  if (!order) return <div>Loading…</div>
  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold">Order #{order._id.slice(-6)}</div>
      <div className="text-gray-600">Status: {order.status}</div>
      <div className="space-y-2">
        {order.items.map((it, idx) => (
          <div key={idx} className="flex items-center justify-between rounded border p-2">
            <div>{it.name} × {it.quantity}</div>
            <div>₹{it.price * it.quantity}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t pt-3">
        <div className="font-semibold">Total</div>
        <div className="font-bold">₹{order.total}</div>
      </div>
    </div>
  )
}


