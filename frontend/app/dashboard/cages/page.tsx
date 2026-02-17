'use client'

import { useEffect, useState } from 'react'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { useToast } from '@/components/ui/ToastContext'

type Cage = {
  public_id: string
  code: string
  location: string
}

export default function CagesPage() {
  const { showToast } = useToast()

  const [cages, setCages] = useState<Cage[]>([])
  const [filtered, setFiltered] = useState<Cage[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)

  const [editData, setEditData] = useState<Cage | null>(null)

  const [form, setForm] = useState({
    code: '',
    location: '',
  })

  async function fetchCages() {
    setLoading(true)
    try {
      const res = await fetch('/api/proxy/cages')
      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Failed to fetch cages', 'error')
        return
      }

      setCages(data)
      setFiltered(data)
    } catch {
      showToast('Network error', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCages()
  }, [])

  useEffect(() => {
    const result = cages.filter(
      (c) =>
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [search, cages])

  // CREATE
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)

    try {
      const res = await fetch('/api/proxy/cages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Create failed', 'error')
        return
      }

      showToast('Cage created successfully', 'success')
      setForm({ code: '', location: '' })
      setOpenCreate(false)
      fetchCages()
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
      const res = await fetch(`/api/proxy/cages/${editData.public_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: editData.code,
          location: editData.location,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Update failed', 'error')
        return
      }

      showToast('Cage updated successfully', 'success')
      setOpenEdit(false)
      setEditData(null)
      fetchCages()
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
      const res = await fetch(`/api/proxy/cages/${deleteId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Delete failed', 'error')
        return
      }

      showToast('Cage deleted successfully', 'success')
      setDeleteId(null)
      fetchCages()
    } catch {
      showToast('Unexpected error occurred', 'error')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Cage Management
        </h1>

        <div className="flex gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 size-5 text-gray-400" />
            <input
              placeholder="Search cage..."
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
            Add Cage
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 bg-white rounded-xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No cages found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">
                Code
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">
                Location
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-600">
                Action
              </th>
            </tr>
            </thead>
            <tbody>
            {filtered.map((c) => (
              <tr
                key={c.public_id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {c.code}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {c.location}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => {
                      setEditData(c)
                      setOpenEdit(true)
                    }}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <PencilIcon className="size-5 inline" />
                  </button>

                  <button
                    onClick={() => setDeleteId(c.public_id)}
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

      {/* CREATE MODAL */}
      {openCreate && (
        <Modal title="Create Cage" onClose={() => setOpenCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              placeholder="Cage Code"
              required
              value={form.code}
              onChange={(e) =>
                setForm({ ...form, code: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
            />
            <input
              placeholder="Location"
              required
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
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
        <Modal title="Edit Cage" onClose={() => setOpenEdit(false)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              value={editData.code}
              onChange={(e) =>
                setEditData({ ...editData, code: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
            />
            <input
              value={editData.location}
              onChange={(e) =>
                setEditData({ ...editData, location: e.target.value })
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
        <Modal title="Delete Cage?" onClose={() => setDeleteId(null)}>
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
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
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
