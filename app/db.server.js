import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  // In production, create a new instance
  prisma = new PrismaClient({
    log: [ 'warn', 'error' ],
  });
} else {
  // In development, use a global variable to prevent creating multiple instances
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: [ 'warn', 'error' ],
    });
  }
  prisma = global.prisma;
}

export default prisma;
