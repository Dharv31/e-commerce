'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

type User = {
  id: string
  name?: string
  email?: string
  phone?: string
  role?: string
  address?: string
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/users', {
        params: { limit: 100 },
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setUsers(res.data.docs || [])
    } catch (error) {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?')
    if (!confirmDelete) return

    try {
      await axios.delete(`/api/users/${id}`)
      setUsers((prev) => prev.filter((user) => user.id !== id))
      toast.success('User deleted successfully')
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  const roleBadge = (role: string | undefined) => {
    const base = 'px-2 py-1 rounded-full text-xs font-semibold'
    switch (role) {
      case 'admin':
        return <span className={`${base} bg-red-100 text-red-800`}>Admin</span>
      case 'customer':
        return <span className={`${base} bg-blue-100 text-blue-800`}>Customer</span>
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>Unknown</span>
    }
  }

  return (
    <div className="p-20 bg-gray-50">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">👥 User Management</h1>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full table-fixed  divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
            <tr>
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Address</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {loading ? (
              <tr>
                <td className="px-6 py-4 text-center" colSpan={7}>
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td className="px-6 py-4 text-center text-gray-500" colSpan={7}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id || index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.phone || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{roleBadge(user.role)}</td>
                  <td className="px-6 py-4 break-all max-w-[200px] text-sm">{user.address || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UsersPage
