import { PrismaClient } from "@prisma/client"

// mimic prisma createClient function
let prisma: PrismaClient | null = null

export function createClient() {
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}




