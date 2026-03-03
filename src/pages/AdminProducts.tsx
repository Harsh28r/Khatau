import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

type Product = { _id?: string; name: string; description?: string; price: number; category?: string; imageUrl?: string }

export default function AdminProducts() {
  const { token } = useAuth()
  const [items, setItems] = useState<Product[]>([])
  const [form, setForm] = useState<Product>({ name: '', price: 0 })
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message?: string }>({ type: 'idle' })
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    const res = await fetch('/api/products')
    if (res.ok) setItems(await res.json())
  }
  useEffect(() => { load() }, [])

  async function save(e?: React.FormEvent) {
    e?.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setStatus({ type: 'idle' })
    try {
      const payload: any = {
        name: form.name,
        price: Number(form.price),
        category: form.category?.trim() || undefined,
        description: form.description?.trim() || undefined,
        imageUrl: form.imageUrl?.trim() || undefined,
      }
      const url = form._id ? `/api/admin/products/${form._id}` : '/api/admin/products'
      const method = form._id ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error(`Failed (${res.status})`)
      setStatus({ type: 'success', message: form._id ? 'Product updated.' : 'Product created.' })
      setForm({ name: '', price: 0 })
      load()
    } catch (err: any) {
      setStatus({ type: 'error', message: err?.message || 'Something went wrong' })
    } finally {
      setSubmitting(false)
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers: { Authorization: token ? `Bearer ${token}` : '' } })
    if (res.ok) load()
  }

  async function uploadImage(file: File) {
    const data = new FormData()
    data.append('image', file)
    const res = await fetch('/api/admin/products/upload', { method: 'POST', headers: { Authorization: token ? `Bearer ${token}` : '' }, body: data })
    if (res.ok) {
      const { url } = await res.json()
      setForm((f) => ({ ...f, imageUrl: url }))
    }
  }

  function startEdit(p: Product) {
    setForm({ _id: p._id, name: p.name, price: p.price, category: p.category, description: p.description, imageUrl: p.imageUrl })
    setStatus({ type: 'idle' })
  }

  function cancelEdit() {
    setForm({ name: '', price: 0 })
    setStatus({ type: 'idle' })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="mb-3 text-2xl font-bold">Products</h2>
        <div className="space-y-3">
          {items.map((p) => (
            <div key={p._id} className="flex items-center justify-between gap-3 rounded border p-3">
              <div className="flex items-center gap-3">
                {p.imageUrl && <img src={p.imageUrl} alt="" className="h-12 w-12 rounded object-cover" />}
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">₹{p.price} {p.category ? `• ${p.category}` : ''}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-blue-600" onClick={() => startEdit(p)}>Edit</button>
                {p._id && <button className="text-red-600" onClick={() => { remove(p._id!); if (form._id === p._id) cancelEdit() }}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-1 text-xl font-semibold">{form._id ? 'Edit Product' : 'Add Product'}</h3>
        {form._id && <div className="mb-2 text-xs text-gray-500">Editing ID: {form._id}</div>}
        <form onSubmit={save} className="grid grid-cols-12 gap-4">
          {status.type === 'success' && <div className="col-span-12 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-700">{status.message}</div>}
          {status.type === 'error' && <div className="col-span-12 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{status.message}</div>}
          <div className="col-span-12 md:col-span-6">
            <label className="mb-1 block text-sm font-medium">Name</label>
            <Input placeholder="Bhelpuri" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required disabled={submitting} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <label className="mb-1 block text-sm font-medium">Price</label>
            <Input type="number" placeholder="80" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required disabled={submitting} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <label className="mb-1 block text-sm font-medium">Category</label>
            <Input placeholder="chaat / sandwich / beverage" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} disabled={submitting} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <label className="mb-1 block text-sm font-medium">Image URL (optional)</label>
            <Input placeholder="https://..." value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} disabled={submitting} />
          </div>
          <div className="col-span-12">
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea className="w-full rounded border border-gray-300 p-2 text-sm outline-none ring-red-600/20 transition focus:ring-2" rows={3} placeholder="Delicious, crunchy..." value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} disabled={submitting} />
          </div>
          <div className="col-span-12">
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : (form._id ? 'Update Product' : 'Save Product')}</Button>
            {form._id && <button type="button" className="ml-3 rounded border px-3 py-2 text-sm hover:bg-gray-50" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
        <div className="mt-4 text-xs text-gray-500">Or upload image:</div>
        <input type="file" onChange={(e) => e.target.files && uploadImage(e.target.files[0])} />
        {form.imageUrl && <div className="text-sm text-gray-600">Uploaded: {form.imageUrl}</div>}
      </div>
    </div>
  )
}


