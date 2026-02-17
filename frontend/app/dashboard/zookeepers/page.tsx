'use client'

import { useEffect, useState } from 'react'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { useToast } from '@/components/ui/ToastContext'

type Zookeeper = {
  public_id: string
  username: string
  name: string
}

export default function ZookeepersPage() {
  const { showToast } = useToast()

  const [zookeepers, setZookeepers] = useState<Zookeeper[]>([])
  const [filtered, setFiltered] = useState<Zookeeper[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)

  const [editData, setEditData] = useState<Zookeeper | null>(null)

  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
  })

  async function fetchZookeepers() {
    setLoading(true)
    try {
      const res = await fetch('/api/proxy/zookeepers')
      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Failed to fetch zookeepers', 'error')
        return
      }

      setZookeepers(data)
      setFiltered(data)
    } catch {
      showToast('Network error', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchZookeepers()
  }, [])

  useEffect(() => {
    const result = zookeepers.filter(
      (z) =>
        z.username.toLowerCase().includes(search.toLowerCase()) ||
        z.name.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [search, zookeepers])

  // CREATE
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)

    try {
      const res = await fetch('/api/proxy/zookeepers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Create failed', 'error')
        return
      }

      showToast('Zookeeper created successfully', 'success')

      setForm({ username: '', password: '', name: '' })
      setOpenCreate(false)
      fetchZookeepers()
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
        `/api/proxy/zookeepers/${editData.public_id}`,
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

      showToast('Zookeeper updated successfully', 'success')

      setOpenEdit(false)
      setEditData(null)
      fetchZookeepers()
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
      const res = await fetch(`/api/proxy/zookeepers/${deleteId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Delete failed', 'error')
        return
      }

      showToast('Zookeeper deleted successfully', 'success')
      setDeleteId(null)
      fetchZookeepers()
    } catch {
      showToast('Unexpected error occurred', 'error')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Zookeeper Management</h1>

        <div className="flex gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 size-5 text-gray-400" />
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md text-sm"
            />
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2 bg-indigo-600 px-4 py-2 text-sm text-white rounded-md"
          >
            <PlusIcon className="size-5" />
            Add Zookeeper
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
            {filtered.map((z) => (
              <tr key={z.public_id} className="border-t">
                <td className="px-6 py-4">{z.username}</td>
                <td className="px-6 py-4">{z.name}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => {
                      setEditData(z)
                      setOpenEdit(true)
                    }}
                    className="text-indigo-600"
                  >
                    <PencilIcon className="size-5 inline" />
                  </button>

                  <button
                    onClick={() => setDeleteId(z.public_id)}
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
        <Modal title="Create Zookeeper" onClose={() => setOpenCreate(false)}>
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
        <Modal title="Edit Zookeeper" onClose={() => setOpenEdit(false)}>
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
        <Modal title="Delete Zookeeper?" onClose={() => setDeleteId(null)}>
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
