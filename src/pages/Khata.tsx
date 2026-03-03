import { useEffect, useState } from 'react'
import Container from '../components/ui/Container'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../auth/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'

interface Customer {
  _id: string
  name: string
  nameHindi?: string
  phone: string
  address?: string
  totalCredit: number
  totalPaid: number
  currentBalance: number
  lastPaymentDate?: string
}

interface Stats {
  totalCustomers: number
  totalOutstanding: number
  totalCredit: number
  totalCollected: number
}

export default function Khata() {
  const { token } = useAuth()
  const { isHindi } = useLanguage()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState<Customer | null>(null)
  const [showCreditModal, setShowCreditModal] = useState<Customer | null>(null)

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [custRes, statsRes] = await Promise.all([
      fetch('/api/customers/with-credit', { headers }),
      fetch('/api/customers/stats/summary', { headers }),
    ])
    if (custRes.ok) setCustomers(await custRes.json())
    if (statsRes.ok) setStats(await statsRes.json())
  }

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.nameHindi?.includes(search) ||
      c.phone.includes(search)
  )

  return (
    <Container>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isHindi ? '📒 उधार खाता' : '📒 Credit Book (Khata)'}</h1>
        <Button onClick={() => setShowAddModal(true)}>{isHindi ? '+ ग्राहक जोड़ें' : '+ Add Customer'}</Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={isHindi ? 'कुल बाकी' : 'Total Outstanding'}
            value={`₹${stats.totalOutstanding.toLocaleString('en-IN')}`}
            color="text-red-600"
            bg="bg-red-50"
          />
          <StatCard
            label={isHindi ? 'वसूली' : 'Collected'}
            value={`₹${stats.totalCollected.toLocaleString('en-IN')}`}
            color="text-green-600"
            bg="bg-green-50"
          />
          <StatCard
            label={isHindi ? 'कुल उधार दिया' : 'Total Credit Given'}
            value={`₹${stats.totalCredit.toLocaleString('en-IN')}`}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            label={isHindi ? 'ग्राहक' : 'Customers'}
            value={stats.totalCustomers.toString()}
            color="text-purple-600"
            bg="bg-purple-50"
          />
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder={isHindi ? '🔍 नाम या फ़ोन से खोजें...' : '🔍 Search by name or phone...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-lg"
        />
      </div>

      {/* Customer List */}
      <div className="space-y-3">
        {filtered.map((customer) => (
          <CustomerCard
            key={customer._id}
            customer={customer}
            isHindi={isHindi}
            onPayment={() => setShowPaymentModal(customer)}
            onCredit={() => setShowCreditModal(customer)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            {isHindi ? 'कोई उधार बाकी नहीं 🎉' : 'No pending credit 🎉'}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && <AddCustomerModal onClose={() => setShowAddModal(false)} onSave={loadData} isHindi={isHindi} />}
      {showPaymentModal && (
        <PaymentModal
          customer={showPaymentModal}
          onClose={() => setShowPaymentModal(null)}
          onSave={loadData}
          isHindi={isHindi}
        />
      )}
      {showCreditModal && (
        <CreditModal
          customer={showCreditModal}
          onClose={() => setShowCreditModal(null)}
          onSave={loadData}
          isHindi={isHindi}
        />
      )}
    </Container>
  )
}

function StatCard({ label, value, color, bg }: { label: string; value: string; color: string; bg: string }) {
  return (
    <div className={`rounded-xl ${bg} p-4`}>
      <div className="text-sm text-gray-600">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${color}`}>{value}</div>
    </div>
  )
}

function CustomerCard({
  customer,
  isHindi,
  onPayment,
  onCredit,
}: {
  customer: Customer
  isHindi: boolean
  onPayment: () => void
  onCredit: () => void
}) {
  const displayName = isHindi && customer.nameHindi ? customer.nameHindi : customer.name

  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-xl font-bold text-white">
          {displayName[0]}
        </div>
        <div>
          <div className="text-lg font-semibold">{displayName}</div>
          <div className="text-sm text-gray-500">📞 {customer.phone}</div>
          {customer.lastPaymentDate && (
            <div className="text-xs text-gray-400">
              {isHindi ? 'आखिरी पेमेंट: ' : 'Last: '}
              {new Date(customer.lastPaymentDate).toLocaleDateString('hi-IN')}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600">₹{customer.currentBalance.toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-500">{isHindi ? 'बाकी' : 'due'}</div>
        </div>
        <div className="flex flex-col gap-2">
          <Button size="sm" variant="primary" onClick={onPayment}>
            {isHindi ? '💰 वसूली' : '💰 Payment'}
          </Button>
          <Button size="sm" variant="outline" onClick={onCredit}>
            {isHindi ? '➕ उधार' : '➕ Credit'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function AddCustomerModal({
  onClose,
  onSave,
  isHindi,
}: {
  onClose: () => void
  onSave: () => void
  isHindi: boolean
}) {
  const { token } = useAuth()
  const [form, setForm] = useState({ name: '', nameHindi: '', phone: '', address: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      onSave()
      onClose()
    }
    setLoading(false)
  }

  return (
    <Modal onClose={onClose} title={isHindi ? 'नया ग्राहक जोड़ें' : 'Add New Customer'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder={isHindi ? 'नाम (English)' : 'Name (English)'}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          placeholder={isHindi ? 'नाम (हिंदी)' : 'Name (Hindi)'}
          value={form.nameHindi}
          onChange={(e) => setForm({ ...form, nameHindi: e.target.value })}
        />
        <Input
          placeholder={isHindi ? 'फ़ोन नंबर' : 'Phone Number'}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <Input
          placeholder={isHindi ? 'पता' : 'Address'}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? '...' : isHindi ? 'जोड़ें' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function PaymentModal({
  customer,
  onClose,
  onSave,
  isHindi,
}: {
  customer: Customer
  onClose: () => void
  onSave: () => void
  isHindi: boolean
}) {
  const { token } = useAuth()
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState<'cash' | 'upi' | 'other'>('cash')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(`/api/customers/${customer._id}/payment`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount), method }),
    })
    if (res.ok) {
      onSave()
      onClose()
    }
    setLoading(false)
  }

  const displayName = isHindi && customer.nameHindi ? customer.nameHindi : customer.name

  return (
    <Modal onClose={onClose} title={isHindi ? `💰 ${displayName} से वसूली` : `💰 Payment from ${displayName}`}>
      <div className="mb-4 rounded-lg bg-red-50 p-3 text-center">
        <div className="text-sm text-gray-600">{isHindi ? 'बाकी रकम' : 'Outstanding'}</div>
        <div className="text-2xl font-bold text-red-600">₹{customer.currentBalance.toLocaleString('en-IN')}</div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="number"
          placeholder={isHindi ? 'रकम डालें' : 'Enter amount'}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="1"
          max={customer.currentBalance}
          className="text-xl"
        />
        <div className="flex gap-2">
          {(['cash', 'upi', 'other'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`flex-1 rounded-lg border p-2 ${method === m ? 'border-green-500 bg-green-50' : ''}`}
            >
              {m === 'cash' ? '💵 Cash' : m === 'upi' ? '📱 UPI' : '🔄 Other'}
            </button>
          ))}
        </div>
        {/* Quick amount buttons */}
        <div className="flex flex-wrap gap-2">
          {[100, 500, 1000, customer.currentBalance].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmount(String(amt))}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
            >
              ₹{amt.toLocaleString('en-IN')}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {isHindi ? 'रद्द' : 'Cancel'}
          </Button>
          <Button type="submit" disabled={loading || !amount}>
            {loading ? '...' : isHindi ? '✓ पेमेंट दर्ज करें' : '✓ Record Payment'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function CreditModal({
  customer,
  onClose,
  onSave,
  isHindi,
}: {
  customer: Customer
  onClose: () => void
  onSave: () => void
  isHindi: boolean
}) {
  const { token } = useAuth()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(`/api/customers/${customer._id}/credit`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount) }),
    })
    if (res.ok) {
      onSave()
      onClose()
    }
    setLoading(false)
  }

  const displayName = isHindi && customer.nameHindi ? customer.nameHindi : customer.name

  return (
    <Modal onClose={onClose} title={isHindi ? `➕ ${displayName} को उधार` : `➕ Credit to ${displayName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="number"
          placeholder={isHindi ? 'उधार की रकम' : 'Credit amount'}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="1"
          className="text-xl"
        />
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {isHindi ? 'रद्द' : 'Cancel'}
          </Button>
          <Button type="submit" disabled={loading || !amount}>
            {loading ? '...' : isHindi ? '✓ उधार जोड़ें' : '✓ Add Credit'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-xl font-bold">{title}</h2>
        {children}
      </div>
    </div>
  )
}



