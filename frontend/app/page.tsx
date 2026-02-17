import { cookies } from 'next/headers'
import Link from 'next/link'
import {
  ShieldCheckIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'About', href: '#about' },
]

const features = [
  {
    name: 'Zookeeper & Manager Management',
    description:
      'Role-based access control to manage managers and zookeepers securely.',
    icon: UsersIcon,
  },
  {
    name: 'Cage & Animal Monitoring',
    description:
      'Centralized animal records and cage tracking system.',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Operational Coordination',
    description:
      'Organize daily tasks and ensure smooth park operations.',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Enterprise-Level Security',
    description:
      'Secure authentication with protected dashboard access.',
    icon: ShieldCheckIcon,
  },
]

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')
  const isLoggedIn = !!token

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur border-b">
        <nav className="flex items-center justify-between p-6 lg:px-8">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            WIT Leisure Park
          </Link>

          <div className="hidden lg:flex lg:gap-x-10">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div>
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Login
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="pt-32">
        <div className="bg-linear-to-br from-indigo-50 to-white py-20">
          <div className="mx-auto max-w-5xl text-center px-6">
            <h1 className="text-5xl font-bold text-gray-900">
              WIT Leisure Park
              <span className="block text-indigo-600">
                Management System
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              A secure and centralized administration platform to manage
              zookeepers, cages, animals, and park operations efficiently.
            </p>

            <div className="mt-10">
              {!isLoggedIn ? (
                <Link
                  href="/login"
                  className="rounded-lg bg-indigo-600 px-8 py-3 text-white font-semibold hover:bg-indigo-500 shadow-md"
                >
                  Access Dashboard
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-indigo-600 px-8 py-3 text-white font-semibold hover:bg-indigo-500 shadow-md"
                >
                  Continue to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold text-gray-900">
            Core Features
          </h2>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="rounded-xl border p-6 hover:shadow-md transition"
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
        <div id="about" className="mt-32 bg-gray-50 py-20">
          <div className="mx-auto max-w-3xl text-center px-6">
            <h2 className="text-3xl font-semibold text-gray-900">
              Designed for Operational Excellence
            </h2>
            <p className="mt-6 text-gray-600">
              Built to streamline coordination between managers and
              zookeepers while ensuring efficient animal and cage management
              across the park.
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-24 border-t py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} WIT Leisure Park. All rights reserved.
      </footer>
    </div>
  )
}
