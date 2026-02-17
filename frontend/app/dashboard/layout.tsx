'use client'

import { useState } from 'react'
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

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Managers', href: '/dashboard/managers', icon: UsersIcon },
  { name: 'Zookeepers', href: '/dashboard/zookeepers', icon: UsersIcon },
  { name: 'Cages', href: '/dashboard/cages', icon: BuildingOfficeIcon },
  { name: 'Animals', href: '/dashboard/animals', icon: ClipboardDocumentListIcon },
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
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Mobile Sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="lg:hidden relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-gray-900/80" />

        <div className="fixed inset-0 flex">
          <DialogPanel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <span className="font-bold text-indigo-600">
                WIT Leisure Park
              </span>
              <button onClick={() => setSidebarOpen(false)}>
                <XMarkIcon className="size-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const current = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      current
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-100',
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium'
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
                className="flex w-full items-center gap-2 text-sm text-red-600"
              >
                <ArrowRightStartOnRectangleIcon className="size-5" />
                Logout
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-white border-r">
        <div className="h-16 flex items-center px-6 font-bold text-indigo-600 border-b">
          WIT Leisure Park
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const current = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  current
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100',
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium'
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
            className="flex items-center gap-2 text-sm text-red-600"
          >
            <ArrowRightStartOnRectangleIcon className="size-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
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
  )
}
