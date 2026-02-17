'use client'

import { useEffect, useState } from 'react'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { useToast } from '@/components/ui/ToastContext'

type Manager = {
  public_id: string
  username: string
  name: string
}

export default function ManagersPage() {
  const { showToast } = useToast()

  const [managers, setManagers] = useState<Manager[]>([])
  const [filtered, setFiltered] = useState<Manager[]>([])
  const [loading, setLoading] = useState(true)

  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Manager | null>(null)

  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
  })

  async function fetchManagers() {
    setLoading(true)
    try {
      const res = await fetch('/api/proxy/managers')
      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Failed to fetch managers', 'error')
        return
      }

      setManagers(data)
      setFiltered(data)
    } catch {
      showToast('Network error', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchManagers()
  }, [])

  useEffect(() => {
    const result = managers.filter(
      (m) =>
        m.username.toLowerCase().includes(search.toLowerCase()) ||
        m.name.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [search, managers])

  // CREATE
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)

    try {
      const res = await fetch('/api/proxy/managers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Create failed', 'error')
        return
      }

      showToast('Manager created successfully', 'success')

      setForm({ username: '', password: '', name: '' })
      setOpenCreate(false)
      fetchManagers()
    } catch {
      showToast('Unexpected error occurred', 'error')
    } finally {
      setCreating(false)
    }
  }

  // UPDATE
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editData) return

    setUpdating(true)

    try {
      const res = await fetch(
        `/api/proxy/managers/${editData.public_id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: editData.name }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Update failed', 'error')
        return
      }

      showToast('Manager updated successfully', 'success')

      setOpenEdit(false)
      setEditData(null)
      fetchManagers()
    } catch {
      showToast('Unexpected error occurred', 'error')
    } finally {
      setUpdating(false)
    }
  }

  // DELETE
  async function confirmDelete() {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/proxy/managers/${deleteId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Delete failed', 'error')
        return
      }

      showToast('Manager deleted successfully', 'success')
      setDeleteId(null)
      fetchManagers()
    } catch {
      showToast('Unexpected error occurred', 'error')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Manager Management
        </h1>

        <div className="flex gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 size-5 text-gray-400" />
            <input
              placeholder="Search manager..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2 bg-indigo-600 px-4 py-2 text-sm text-white rounded-md hover:bg-indigo-500 transition"
          >
            <PlusIcon className="size-5" />
            Add Manager
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Username</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
            </thead>
            <tbody>
            {filtered.map((manager) => (
              <tr key={manager.public_id} className="border-t">
                <td className="px-6 py-4">{manager.username}</td>
                <td className="px-6 py-4">{manager.name}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => {
                      setEditData(manager)
                      setOpenEdit(true)
                    }}
                    className="text-indigo-600"
                  >
                    <PencilIcon className="size-5 inline" />
                  </button>

                  <button
                    onClick={() => setDeleteId(manager.public_id)}
                    className="text-red-600"
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

      {/* CREATE MODAL */}
      {openCreate && (
        <Modal
          title="Create Manager"
          onClose={() => setOpenCreate(false)}
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              placeholder="Username"
              required
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
            />
            <input
              placeholder="Full Name"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
            />
            <button
              disabled={creating}
              className="w-full bg-indigo-600 text-white py-2 rounded-md"
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {openEdit && editData && (
        <Modal
          title="Edit Manager"
          onClose={() => setOpenEdit(false)}
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              value={editData.username}
              disabled
              className="w-full border rounded-md px-3 py-2 bg-gray-100"
            />
            <input
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
            />
            <button
              disabled={updating}
              className="w-full bg-indigo-600 text-white py-2 rounded-md"
            >
              {updating ? 'Updating...' : 'Update'}
            </button>
          </form>
        </Modal>
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <Modal
          title="Delete Manager?"
          onClose={() => setDeleteId(null)}
        >
          <div className="space-y-4 text-center">
            <p>This action cannot be undone.</p>
            <button
              onClick={confirmDelete}
              className="w-full bg-red-600 text-white py-2 rounded-md"
            >
              Confirm Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* Reusable Modal */
function Modal({
                 title,
                 children,
                 onClose,
               }: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
