import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  return handle(req, context)
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  return handle(req, context)
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  return handle(req, context)
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  return handle(req, context)
}

async function handle(
  req: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await context.params

  const token = req.cookies.get('access_token')?.value

  const joinedPath = path?.join('/') || ''

  const backendURL = `${process.env.BACKEND_URL}/api/${joinedPath}`

  console.log('Proxy →', backendURL)

  const backendRes = await fetch(backendURL, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: req.method !== 'GET' ? await req.text() : undefined,
  })

  const body = await backendRes.text()

  return new NextResponse(body, {
    status: backendRes.status,
    headers: {
      'Content-Type':
        backendRes.headers.get('content-type') || 'application/json',
    },
  })
}
