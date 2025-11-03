
import { cookies } from "next/headers"

export async function createClient() {
  const prismaUrl = process.env.NEXT_PUBLIC_prisma_URL
  const prismaAnonKey = process.env.NEXT_PUBLIC_prisma_ANON_KEY

  if (!prismaUrl || !prismaAnonKey) {
    throw new Error(
      "Missing prisma environment variables. Please configure NEXT_PUBLIC_prisma_URL and NEXT_PUBLIC_prisma_ANON_KEY",
    )
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("sb-access-token")?.value

  const prisma = createprismaClient(prismaUrl, prismaAnonKey, {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  })

  return prisma
}




