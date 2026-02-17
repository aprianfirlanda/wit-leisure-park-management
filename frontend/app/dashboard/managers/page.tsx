'use client'

import { useEffect, useState } from 'react'
import {
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

type Manager = {
  public_id: string
  username: string
  name: string
}

export default function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
  })

  async function fetchManagers() {
    try {
      const res = await fetch('/api/proxy/managers')
      const data = await res.json()
      setManagers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchManagers()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()

    await fetch('/api/proxy/managers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setForm({ username: '', password: '', name: '' })
    setOpen(false)
    fetchManagers()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/proxy/managers/${id}`, {
      method: 'DELETE',
    })

    fetchManagers()
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Manager Management
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          <PlusIcon className="size-5" />
          Add Manager
        </button>
      </div>

      {/* Table */}
      <div className="mt-8 bg-white shadow-sm border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Loading managers...</div>
        ) : managers.length === 0 ? (
          <div className="p-6 text-gray-500">No managers found.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Username
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
            {managers.map((manager) => (
              <tr key={manager.public_id}>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {manager.username}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {manager.name}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() =>
                      handleDelete(manager.public_id)
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="size-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900">
              Create New Manager
            </h2>

            <form onSubmit={handleCreate} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  required
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
