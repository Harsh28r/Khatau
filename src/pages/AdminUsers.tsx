import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import Container from '../components/ui/Container'

type User = { _id: string; name: string; email: string; role?: 'user' | 'admin'; createdAt: string }

export default function AdminUsers() {
  const { token } = useAuth()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/users', { headers: { Authorization: token ? `Bearer ${token}` : '' } })
      if (res.ok) setUsers(await res.json())
    }
    load()
  }, [])

  return (
    <Container>
      <h2 className="mb-4 text-2xl font-bold">Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Email</th>
              <th className="border px-3 py-2 text-left">Role</th>
              <th className="border px-3 py-2 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="odd:bg-white even:bg-gray-50">
                <td className="border px-3 py-2">{u.name}</td>
                <td className="border px-3 py-2">{u.email}</td>
                <td className="border px-3 py-2 capitalize">{u.role || 'user'}</td>
                <td className="border px-3 py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div className="py-6 text-gray-600">No users found.</div>}
      </div>
    </Container>
  )
}


