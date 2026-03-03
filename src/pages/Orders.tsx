import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { io } from 'socket.io-client'

type Order = { _id: string; total: number; status: string; createdAt: string }

export default function Orders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])

  async function load() {
    const res = await fetch('/api/orders/mine', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
    if (res.ok) setOrders(await res.json())
  }

  useEffect(() => {
    load()
    const socket = io('/', { path: '/socket.io' })
    socket.on('order:updated', () => load())
    socket.on('order:created', () => load())
    return () => socket.close()
    const id = setInterval(load, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold">Your Orders</h2>
      {orders.map((o) => (
        <div key={o._id} className="flex items-center justify-between rounded border p-3">
          <div>
            <div className="font-medium">Order #{o._id.slice(-6)}</div>
            <div className="text-sm text-gray-600">Status: {o.status}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-semibold">₹{o.total}</div>
            <Link className="text-red-600" to={`/orders/${o._id}`}>View</Link>
          </div>
        </div>
      ))}
      {orders.length === 0 && <div className="text-gray-600">No orders yet.</div>}
    </div>
  )
}


