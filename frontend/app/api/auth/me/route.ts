import { NextRequest, NextResponse } from 'next/server'

function parseJwt(token: string) {
  const base64Payload = token.split('.')[1]
  const payload = Buffer.from(base64Payload, 'base64').toString()
  return JSON.parse(payload)
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  if (!token) return NextResponse.json({})

  try {
    const payload = parseJwt(token)
    return NextResponse.json({
      role: payload.role,
      sub: payload.sub,
    })
  } catch {
    return NextResponse.json({})
  }
}
