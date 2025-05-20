'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import toast, { Toaster } from 'react-hot-toast'

type User = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
  address: string
  phone: string
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<User | null>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/users/me', {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        setUser(res.data?.user || null)
        setFormData(res.data?.user || null)
        toast.success('Profile loaded')
      } catch (error) {
        console.error('Error fetching user:', error)
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null
    )
  }

  const handleSave = async () => {
    if (formData) {
      const toastId = toast.loading('Saving changes...')
      try {
        const res = await axios.patch(`/api/users/${user?.id}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        setUser(res.data?.doc || null)
        setFormData(res.data?.doc || null)
        setEditing(false)
        router.refresh()
        toast.success('Profile updated successfully', { id: toastId })
      } catch (error) {
        console.error('Error saving user:', error)
        toast.error('Failed to update profile', { id: toastId })
      }
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">👤 Your Profile</h1>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading profile...</p>
      ) : !user ? (
        <p className="text-center text-red-500 text-lg">User not found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold uppercase">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{user.address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Joined On</p>
              <p className="font-medium">{dayjs(user.createdAt).format('MMMM D, YYYY')}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>

          {editing && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData?.name || ''}
                      onChange={handleChange}
                      className="border rounded-lg w-full p-2 mt-1 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData?.email || ''}
                      onChange={handleChange}
                      className="border rounded-lg w-full p-2 mt-1 text-gray-700"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData?.phone || ''}
                      onChange={handleChange}
                      className="border rounded-lg w-full p-2 mt-1 text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData?.address || ''}
                      onChange={handleChange}
                      className="border rounded-lg w-full p-2 mt-1 text-gray-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProfilePage
