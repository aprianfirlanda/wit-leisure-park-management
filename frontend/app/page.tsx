'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/login' },
  { name: 'Features', href: '#features' },
  { name: 'About', href: '#about' },
]

const features = [
  {
    name: 'Zookeeper Management',
    description:
      'Manage zookeepers and managers efficiently with role-based access control.',
    icon: UsersIcon,
  },
  {
    name: 'Cage & Animal Monitoring',
    description:
      'Track cages, animals, and their details in a centralized system.',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Task & Shift Scheduling',
    description:
      'Organize daily tasks and shifts to ensure smooth park operations.',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Secure Authentication',
    description:
      'JWT-based authentication with secure access management.',
    icon: ShieldCheckIcon,
  },
]

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="/" className="text-xl font-bold text-indigo-600">
              WIT Leisure Park
            </a>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <Bars3Icon className="size-6" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm font-semibold text-gray-900">
                {item.name}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a
              href="/login"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Login
            </a>
          </div>
        </nav>

        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full bg-white p-6 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-600">WIT Leisure Park</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <XMarkIcon className="size-6" />
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {navigation.map((item) => (
                <a key={item.name} href={item.href} className="block text-base font-semibold">
                  {item.name}
                </a>
              ))}
              <a
                href="/login"
                className="block rounded-md bg-indigo-600 px-4 py-2 text-center text-white"
              >
                Login
              </a>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* Hero Section */}
      <main className="pt-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900">
            WIT Leisure Park Management System
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            A centralized platform to manage managers, zookeepers, cages,
            animals, tasks, and park operations efficiently.
          </p>

          <div className="mt-10 flex justify-center gap-x-6">
            <a
              href="/login"
              className="rounded-md bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-500"
            >
              Access Dashboard
            </a>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900">
              System Features
            </h2>
            <p className="mt-4 text-gray-600">
              Everything needed to manage park operations effectively.
            </p>
          </div>

          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="rounded-xl border p-6 shadow-sm hover:shadow-md transition"
              >
                <feature.icon className="h-8 w-8 text-indigo-600" />
                <h3 className="mt-4 font-semibold text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div id="about" className="mt-32 bg-gray-50 py-16">
          <div className="mx-auto max-w-4xl text-center px-6">
            <h2 className="text-3xl font-semibold text-gray-900">
              Built for Operational Excellence
            </h2>
            <p className="mt-6 text-gray-600">
              Designed to streamline leisure park management, improve
              coordination between managers and zookeepers, and ensure
              efficient animal and cage monitoring.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t py-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} WIT Leisure Park. All rights reserved.
      </footer>
    </div>
  )
}
