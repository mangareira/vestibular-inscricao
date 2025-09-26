import { PrismaClient } from "../app/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString });
const prismaClientSingleton = () => {
  return new PrismaClient({adapter})
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if(process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma