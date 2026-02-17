import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: any) {
  return handle(req, params)
}

export async function POST(req: NextRequest, { params }: any) {
  return handle(req, params)
}

export async function PUT(req: NextRequest, { params }: any) {
  return handle(req, params)
}

export async function DELETE(req: NextRequest, { params }: any) {
  return handle(req, params)
}

async function handle(req: NextRequest, params: any) {
  const token = req.cookies.get('access_token')?.value
  const path = params.path.join('/')

  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/${path}`,
    {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: req.method !== 'GET' ? await req.text() : undefined,
    }
  )

  const data = await backendRes.text()

  return new NextResponse(data, {
    status: backendRes.status,
  })
}
