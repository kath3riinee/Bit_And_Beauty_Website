import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // No prisma configured — skip auth for now
  console.log("[v0] Auth middleware skipped (prisma removed)")
  return NextResponse.next()
}




