'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  XMarkIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { ToastProvider } from '@/components/ui/ToastContext'

type NavItem = {
  name: string
  href: string
  icon: any
  role?: 'MANAGER'
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Managers', href: '/dashboard/managers', icon: UsersIcon, role: 'MANAGER' },
  { name: 'Zookeepers', href: '/dashboard/zookeepers', icon: UsersIcon, role: 'MANAGER' },
  { name: 'Cages', href: '/dashboard/cages', icon: BuildingOfficeIcon, role: 'MANAGER' },
  { name: 'Animals', href: '/dashboard/animals', icon: ClipboardDocumentListIcon, role: 'MANAGER' },
  { name: 'Tasks', href: '/dashboard/tasks', icon: ClipboardDocumentListIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DashboardLayout({
                                          children,
                                        }: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.role) setRole(data.role)
      })
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const filteredNavigation = navigation.filter(
    (item) => !item.role || item.role === role
  )

  return (
    <ToastProvider>
      <div className="h-screen flex bg-gray-50">

        {/* ===================== */}
        {/* MOBILE SIDEBAR */}
        {/* ===================== */}
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="lg:hidden relative z-50">
          <DialogBackdrop className="fixed inset-0 bg-gray-900/80" />

          <div className="fixed inset-0 flex">
            <DialogPanel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b">
                <span className="font-bold text-indigo-600">
                  WIT Leisure Park
                </span>
                <button onClick={() => setSidebarOpen(false)}>
                  <XMarkIcon className="size-6" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {filteredNavigation.map((item) => {
                  const current = pathname.startsWith(item.href)

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={classNames(
                        current
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-100',
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition'
                      )}
                    >
                      <item.icon className="size-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              {/* Logout */}
              <div className="p-4 border-t">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 text-sm text-red-600 hover:text-red-700"
                >
                  <ArrowRightStartOnRectangleIcon className="size-5" />
                  Logout
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* ===================== */}
        {/* DESKTOP SIDEBAR */}
        {/* ===================== */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-white border-r">
          <div className="h-16 flex items-center px-6 font-bold text-indigo-600 border-b">
            WIT Leisure Park
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {filteredNavigation.map((item) => {
              const current = pathname.startsWith(item.href)

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    current
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100',
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition'
                  )}
                >
                  <item.icon className="size-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
            >
              <ArrowRightStartOnRectangleIcon className="size-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* ===================== */}
        {/* MAIN CONTENT */}
        {/* ===================== */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Top Bar */}
          <div className="lg:hidden flex items-center justify-between px-4 py-4 bg-white border-b">
            <button onClick={() => setSidebarOpen(true)}>
              <Bars3Icon className="size-6" />
            </button>
            <span className="font-semibold">Dashboard</span>
          </div>

          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>

      </div>
    </ToastProvider>
  )
}
