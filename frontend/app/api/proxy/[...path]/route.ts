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

export async function PATCH(
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

  if (backendRes.status === 401) {
    const response = NextResponse.json(
      { error: 'Session expired' },
      { status: 401 }
    )

    // Clear cookie
    response.cookies.set('access_token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    })

    return response
  }

  if (backendRes.status === 204) {
    return new NextResponse(null, {
      status: 204,
    })
  }

  const body = await backendRes.text()

  return new NextResponse(body, {
    status: backendRes.status,
    headers: {
      'Content-Type':
        backendRes.headers.get('content-type') || 'application/json',
    },
  })
}
