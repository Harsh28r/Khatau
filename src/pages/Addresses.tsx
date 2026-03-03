import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

type Address = { _id: string; label?: string; line1: string; line2?: string; city: string; pincode: string; isDefault?: boolean }

export default function Addresses() {
  const { token } = useAuth()
  const [list, setList] = useState<Address[]>([])
  const [form, setForm] = useState<Partial<Address>>({})

  async function load() {
    const res = await fetch('/api/addresses', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
    if (res.ok) setList(await res.json())
  }

  useEffect(() => { load() }, [])

  async function add() {
    const res = await fetch('/api/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify(form) })
    if (res.ok) {
      setForm({})
      load()
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="mb-3 text-2xl font-bold">Your Addresses</h2>
        <div className="space-y-3">
          {list.map((a) => (
            <div key={a._id} className="rounded border p-3">
              <div className="font-medium">{a.label || 'Address'}</div>
              <div className="text-sm text-gray-600">{a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city} {a.pincode}</div>
            </div>
          ))}
          {list.length === 0 && <div className="text-gray-600">No addresses yet.</div>}
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-xl font-semibold">Add New</h3>
        <div className="space-y-2">
          <Input placeholder="Label (Home)" value={form.label || ''} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          <Input placeholder="Line 1" value={form.line1 || ''} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
          <Input placeholder="Line 2" value={form.line2 || ''} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
          <div className="flex gap-2">
            <Input placeholder="City" value={form.city || ''} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input placeholder="Pincode" value={form.pincode || ''} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
          </div>
          <Button onClick={add}>Save</Button>
        </div>
      </div>
    </div>
  )
}


