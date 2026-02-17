'use client'

import {useEffect, useState} from 'react'
import {MagnifyingGlassIcon, PencilIcon, PlusIcon, TrashIcon, XMarkIcon,} from '@heroicons/react/24/outline'
import {useToast} from '@/components/ui/ToastContext'

type Animal = {
  public_id: string
  name: string
  species: string
  cage_public_id: string
  date_of_birth: string | null
}

type Cage = {
  public_id: string
  code: string
  location: string
}

export default function AnimalsPage() {
  const {showToast} = useToast()

  const [animals, setAnimals] = useState<Animal[]>([])
  const [filtered, setFiltered] = useState<Animal[]>([])
  const [cages, setCages] = useState<Cage[]>([])

  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [openCreate, setOpenCreate] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)

  const [editData, setEditData] = useState<Animal | null>(null)

  const [form, setForm] = useState({
    name: '',
    species: '',
    cage_public_id: '',
    date_of_birth: '',
  })

  // ================= FETCH =================

  async function fetchAnimals() {
    setLoading(true)
    try {
      const res = await fetch('/api/proxy/animals')
      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Failed to fetch animals', 'error')
        return
      }

      setAnimals(data)
      setFiltered(data)
    } catch {
      showToast('Network error', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function fetchCages() {
    try {
      const res = await fetch('/api/proxy/cages')
      const data = await res.json()
      if (res.ok) setCages(data)
    } catch {
    }
  }

  useEffect(() => {
    fetchAnimals()
    fetchCages()
  }, [])

  useEffect(() => {
    const result = animals.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.species.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [search, animals])

  // ================= CREATE =================

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)

    try {
      const res = await fetch('/api/proxy/animals', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...form,
          date_of_birth: form.date_of_birth || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Create failed', 'error')
        return
      }

      showToast('Animal created successfully', 'success')
      setOpenCreate(false)
      setForm({name: '', species: '', cage_public_id: '', date_of_birth: ''})
      fetchAnimals()
    } catch {
      showToast('Unexpected error occurred', 'error')
    } finally {
      setCreating(false)
    }
  }

  // ================= UPDATE =================

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editData) return

    setUpdating(true)

    try {
      const res = await fetch(
        `/api/proxy/animals/${editData.public_id}`,
        {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            name: editData.name,
            species: editData.species,
            cage_public_id: editData.cage_public_id,
            date_of_birth: editData.date_of_birth || null,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Update failed', 'error')
        return
      }

      showToast('Animal updated successfully', 'success')
      setOpenEdit(false)
      setEditData(null)
      fetchAnimals()
    } catch {
      showToast('Unexpected error occurred', 'error')
    } finally {
      setUpdating(false)
    }
  }

  // ================= DELETE =================

  async function confirmDelete() {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/proxy/animals/${deleteId}`, {
        method: 'DELETE',
      })

      if (res.status === 204) {
        showToast('Animal deleted successfully', 'success')
        setDeleteId(null)
        fetchAnimals()
        return
      }

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || 'Delete failed', 'error')
      }
    } catch {
      showToast('Unexpected error occurred', 'error')
    }
  }

  // ================= HELPERS =================

  function formatDate(date: string | null) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString()
  }

  function cageLabel(id: string) {
    const cage = cages.find((c) => c.public_id === id)
    return cage ? cage.code : 'Unknown'
  }

  // ================= UI =================

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Animal Management</h1>

        <div className="flex gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 size-5 text-gray-400"/>
            <input
              placeholder="Search animal..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md text-sm"
            />
          </div>

          <button
            onClick={() => setOpenCreate(true)}
            className="flex items-center gap-2 bg-indigo-600 px-4 py-2 text-sm text-white rounded-md"
          >
            <PlusIcon className="size-5"/>
            Add Animal
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-8 bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-gray-500">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Species</th>
              <th className="px-6 py-3 text-left">Cage</th>
              <th className="px-6 py-3 text-left">Birth Date</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
            </thead>
            <tbody>
            {filtered.map((a) => (
              <tr key={a.public_id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{a.name}</td>
                <td className="px-6 py-4">{a.species}</td>
                <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                      {cageLabel(a.cage_public_id)}
                    </span>
                </td>
                <td className="px-6 py-4">{formatDate(a.date_of_birth)}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => {
                      setEditData({
                        ...a,
                        date_of_birth: a.date_of_birth
                          ? a.date_of_birth.slice(0, 10)
                          : '',
                      })
                      setOpenEdit(true)
                    }}
                    className="text-indigo-600"
                  >
                    <PencilIcon className="size-5 inline"/>
                  </button>

                  <button
                    onClick={() => setDeleteId(a.public_id)}
                    className="text-red-600"
                  >
                    <TrashIcon className="size-5 inline"/>
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
        <Modal title="Create Animal" onClose={() => setOpenCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              placeholder="Name"
              required
              value={form.name}
              onChange={(e) =>
                setForm({...form, name: e.target.value})
              }
              className="w-full border rounded-md px-3 py-2"
            />

            <input
              placeholder="Species"
              required
              value={form.species}
              onChange={(e) =>
                setForm({...form, species: e.target.value})
              }
              className="w-full border rounded-md px-3 py-2"
            />

            <select
              required
              value={form.cage_public_id}
              onChange={(e) =>
                setForm({...form, cage_public_id: e.target.value})
              }
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select Cage</option>
              {cages.map((c) => (
                <option key={c.public_id} value={c.public_id}>
                  {c.code}
                </option>
              ))}
            </select>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date
              </label>
              <input
                type="date"
                value={form.date_of_birth}
                onChange={(e) =>
                  setForm({ ...form, date_of_birth: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

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
        <Modal title="Edit Animal" onClose={() => setOpenEdit(false)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              value={editData.name}
              onChange={(e) =>
                setEditData({...editData, name: e.target.value})
              }
              className="w-full border rounded-md px-3 py-2"
            />

            <input
              value={editData.species}
              onChange={(e) =>
                setEditData({...editData, species: e.target.value})
              }
              className="w-full border rounded-md px-3 py-2"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Date
              </label>
              <input
                type="date"
                value={editData.date_of_birth || ''}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    date_of_birth: e.target.value,
                  })
                }
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

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
        <Modal title="Delete Animal?" onClose={() => setDeleteId(null)}>
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
          <button onClick={onClose}>
            <XMarkIcon className="size-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
