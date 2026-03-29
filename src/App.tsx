import { Link, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from './cart/CartContext'
import { useAuth } from './auth/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Addresses from './pages/Addresses'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import AdminOrderDetail from './pages/AdminOrderDetail'
import Landing from './pages/Landing'
import Admin from './pages/Admin'
import AdminUsers from './pages/AdminUsers'
import Khata from './pages/Khata'
import { useLanguage } from './i18n/LanguageContext'
import './App.css'
import Button from './components/ui/Button'
import Input from './components/ui/Input'
import Container from './components/ui/Container'
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card'
import Badge from './components/ui/Badge'
import ImageWithFallback from './components/ImageWithFallback'
import CategoryCarousel from './components/CategoryCarousel'
import { useToast } from './toast/ToastContext'
import { Analytics } from '@vercel/analytics/react'

function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      className="rounded-full bg-orange-100 px-2 py-1 text-sm font-medium hover:bg-orange-200"
      title="Switch language"
    >
      {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 EN'}
    </button>
  )
}

function App() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  // If an admin lands on home, auto-redirect to dashboard
  useEffect(() => {
    if (user?.role === 'admin' && location.pathname === '/') {
      navigate('/admin', { replace: true })
    }
  }, [user, location.pathname])
  const isLanding = location.pathname === '/'

  if (isLanding) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
        <Analytics />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <Container className="flex items-center justify-between py-3">
          <Link to="/" className="text-xl font-bold tracking-wide">
            Khatau Bhelpuriwala
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <LanguageToggle />
            <Link to="/menu" className="hover:text-red-600">Menu</Link>
            <Link to="/cart" className="hover:text-red-600">Cart ({items.length})</Link>
            <Link to="/orders" className="hover:text-red-600">Orders</Link>
            {user ? (
              <>
                <span className="text-gray-600">Hi, {user.name}</span>
                <Button variant="secondary" onClick={logout}>Logout</Button>
                <Link to="/addresses" className="hover:text-red-600">Addresses</Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin" className="hover:text-red-600">Admin</Link>
                    <Link to="/admin/khata" className="font-bold text-orange-600 hover:text-orange-700">📒 Khata</Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-red-600">Login</Link>
                <Link to="/signup" className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700">Sign up</Link>
              </>
            )}
          </nav>
        </Container>
      </header>

      <main className="py-8">
        <Container>
        <Routes>
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/addresses" element={<RequireAuth><Addresses /></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
          <Route path="/orders/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="/admin/products" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
          <Route path="/admin/orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
          <Route path="/admin/orders/:id" element={<RequireAdmin><AdminOrderDetail /></RequireAdmin>} />
          <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
          <Route path="/admin/khata" element={<RequireAdmin><Khata /></RequireAdmin>} />
        </Routes>
        </Container>
      </main>

      <footer className="border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Khatau Bhelpuriwala
      </footer>
      <Analytics />
      </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import debounce from 'lodash.debounce'

type Product = { _id: string; name: string; description?: string; price: number; imageUrl?: string; category?: string }

function Menu() {
  const [items, setItems] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState<string>(() => {
    const url = new URL(window.location.href)
    return url.searchParams.get('category') || ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCart()
  const { push } = useToast()

  async function fetchProducts(params: URLSearchParams) {
    const res = await fetch(`/api/products?${params.toString()}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    setItems(data)
  }

  useEffect(() => {
    async function init() {
      try {
        const [catsRes] = await Promise.all([
          fetch('/api/products/categories'),
        ])
        if (catsRes.ok) setCategories(await catsRes.json())
      } catch {}
    }
    init()
  }, [])

  const debouncedFetch = useMemo(() => debounce((qValue: string, categoryValue: string) => {
    const params = new URLSearchParams()
    if (qValue) params.set('q', qValue)
    if (categoryValue) params.set('category', categoryValue)
    fetchProducts(params).catch((e) => setError((e as Error).message)).finally(() => setLoading(false))
  }, 300), [])

  useEffect(() => {
    setLoading(true)
    debouncedFetch(q, category)
    return () => {
      debouncedFetch.cancel()
    }
  }, [q, category])

  if (loading) return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">Menu</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border p-4">
            <div className="mb-3 h-40 w-full rounded-lg bg-gray-200" />
            <div className="mb-2 h-4 w-1/2 rounded bg-gray-200" />
            <div className="h-3 w-3/4 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </section>
  )
  if (error) return <p className="text-red-600">Failed to load: {error}</p>

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">Menu</h2>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" placeholder="Search bhelpuri, sandwich..." />
        <CategoryCarousel items={categories} onSelect={setCategory} active={category} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {items.map((p) => (
          <Card key={p._id} className="border-0 rounded-2xl shadow-md transition-shadow hover:shadow-lg">
            <div className="relative mb-3">
              <ImageWithFallback src={p.imageUrl} alt={p.name} className="h-40 w-full rounded-lg object-cover" />
              {p.category && <Badge variant="info" className="absolute left-2 top-2 capitalize">{p.category}</Badge>}
              <Badge className="absolute right-2 top-2">₹{p.price}</Badge>
            </div>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            {p.description && <CardContent>{p.description}</CardContent>}
            <div className="mt-4">
              <Button onClick={() => { addItem({ id: p._id, name: p.name, price: p.price }); push({ message: `${p.name} added to cart`, type: 'success' }) }}>Add</Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}

function Cart() {
  const { items, removeItem, total } = useCart()
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Your Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-600">Qty: {it.quantity}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-semibold">₹{it.price * it.quantity}</div>
                <button className="text-red-600" onClick={() => removeItem(it.id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-3">
            <div className="font-semibold">Total</div>
            <div className="font-bold">₹{total}</div>
          </div>
        </div>
      )}
      <Link to="/checkout" className="inline-block rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700">
        Proceed to Checkout
      </Link>
    </section>
  )
}

function Checkout() {
  const { items, total, clear } = useCart()
  const { token } = useAuth()
  const [addresses, setAddresses] = useState<Array<{ _id: string; label?: string; line1: string; line2?: string; city: string; pincode: string }>>([])
  const [addressId, setAddressId] = useState<string>('')

  useEffect(() => {
    async function loadAddresses() {
      try {
        const res = await fetch('/api/addresses', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
        if (res.ok) {
          const list = await res.json()
          setAddresses(list)
          if (list.length > 0) setAddressId(list[0]._id)
        }
      } catch {}
    }
    loadAddresses()
  }, [token])

  async function placeOrder() {
    if (items.length === 0) return
    const selected = addresses.find((a) => a._id === addressId)
    const addressStr = selected ? `${selected.line1}${selected.line2 ? ', ' + selected.line2 : ''}, ${selected.city} ${selected.pincode}` : 'Pickup'
    const payload = {
      items: items.map((it) => ({ product: it.id, name: it.name, price: it.price, quantity: it.quantity })),
      customerName: 'Guest',
      phone: 'NA',
      address: addressStr,
    }
    const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify(payload) })
    if (res.ok) {
      clear()
      alert('Order placed!')
    } else {
      alert('Failed to place order')
    }
  }
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Checkout</h2>
      <div className="text-gray-600">Items: {items.length} • Total: ₹{total}</div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Delivery Address</div>
        {addresses.length > 0 ? (
          <select value={addressId} onChange={(e) => setAddressId(e.target.value)} className="w-full max-w-md rounded border p-2">
            {addresses.map((a) => (
              <option key={a._id} value={a._id}>{`${a.label ? a.label + ' • ' : ''}${a.line1}${a.line2 ? ', ' + a.line2 : ''}, ${a.city} ${a.pincode}`}</option>
            ))}
          </select>
        ) : (
          <div className="text-sm text-gray-600">No saved addresses. Add one in Addresses.</div>
        )}
      </div>
      <button onClick={placeOrder} className="rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700">
        Place Order
      </button>
    </section>
  )
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}

export default App
