'use client'

import { useEffect, useState } from 'react'
import {
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { useToast } from '@/components/ui/ToastContext'

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE'

type Task = {
  public_id: string
  title: string
  description?: string
  status: TaskStatus
  due_date?: string
  zookeeper: string
  animal?: string
}

type Zookeeper = {
  public_id: string
  username: string
}

export default function TasksPage() {
  const { showToast } = useToast()

  const [tasks, setTasks] = useState<Task[]>([])
  const [zookeepers, setZookeepers] = useState<Zookeeper[]>([])
  const [loading, setLoading] = useState(true)

  const [openCreate, setOpenCreate] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    zookeeper_public_id: '',
    due_date: '',
  })

  async function fetchTasks() {
    setLoading(true)
    const res = await fetch('/api/proxy/tasks')
    const data = await res.json()

    if (!res.ok) {
      showToast(data.error || 'Failed to fetch tasks', 'error')
      return
    }

    setTasks(data)
    setLoading(false)
  }

  async function fetchZookeepers() {
    const res = await fetch('/api/proxy/zookeepers')
    const data = await res.json()
    if (res.ok) setZookeepers(data)
  }

  useEffect(() => {
    fetchTasks()
    fetchZookeepers()
  }, [])

  // CREATE TASK
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()

    const res = await fetch('/api/proxy/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      showToast(data.error || 'Create failed', 'error')
      return
    }

    showToast('Task created successfully', 'success')
    setOpenCreate(false)
    fetchTasks()
  }

  // UPDATE STATUS
  async function updateStatus(id: string, status: TaskStatus) {
    const res = await fetch(`/api/proxy/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    const data = await res.json()

    if (!res.ok) {
      showToast(data.error || 'Status update failed', 'error')
      return
    }

    showToast('Task updated', 'success')
    fetchTasks()
  }

  // DELETE
  async function confirmDelete() {
    if (!deleteId) return

    const res = await fetch(`/api/proxy/tasks/${deleteId}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const data = await res.json()
      showToast(data.error || 'Delete failed', 'error')
      return
    }

    showToast('Task deleted', 'success')
    setDeleteId(null)
    fetchTasks()
  }

  function statusBadge(status: TaskStatus) {
    const map = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      IN_PROGRESS: 'bg-blue-100 text-blue-700',
      DONE: 'bg-green-100 text-green-700',
    }
    return (
      <span className={`px-2 py-1 rounded text-xs ${map[status]}`}>
        {status}
      </span>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Task Management</h1>

        <button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2 bg-indigo-600 px-4 py-2 text-white rounded-md"
        >
          <PlusIcon className="size-5" />
          Create Task
        </button>
      </div>

      <div className="mt-8 bg-white border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Zookeeper</th>
              <th className="px-6 py-3 text-left">Animal</th>
              <th className="px-6 py-3 text-left">Due</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
            </thead>
            <tbody>
            {tasks.map((t) => (
              <tr key={t.public_id} className="border-b">
                <td className="px-6 py-4">{t.title}</td>
                <td className="px-6 py-4">{t.zookeeper}</td>
                <td className="px-6 py-4">{t.animal || '-'}</td>
                <td className="px-6 py-4">
                  {t.due_date
                    ? new Date(t.due_date).toLocaleDateString()
                    : '-'}
                </td>
                <td className="px-6 py-4">
                  {statusBadge(t.status)}
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <select
                    value={t.status}
                    onChange={(e) =>
                      updateStatus(
                        t.public_id,
                        e.target.value as TaskStatus
                      )
                    }
                    className="border rounded px-2 py-1 text-xs"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                  </select>

                  <button
                    onClick={() => setDeleteId(t.public_id)}
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

      {/* Create Modal */}
      {openCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-lg font-semibold">Create Task</h2>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <input
                placeholder="Title"
                required
                className="w-full border rounded px-3 py-2"
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                className="w-full border rounded px-3 py-2"
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <select
                required
                className="w-full border rounded px-3 py-2"
                onChange={(e) =>
                  setForm({
                    ...form,
                    zookeeper_public_id: e.target.value,
                  })
                }
              >
                <option value="">Select Zookeeper</option>
                {zookeepers.map((z) => (
                  <option key={z.public_id} value={z.public_id}>
                    {z.username}
                  </option>
                ))}
              </select>

              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                onChange={(e) =>
                  setForm({ ...form, due_date: e.target.value })
                }
              />

              <button className="w-full bg-indigo-600 text-white py-2 rounded">
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center">
            <p>Delete this task?</p>
            <button
              onClick={confirmDelete}
              className="bg-red-600 text-white px-4 py-2 mt-4 rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
