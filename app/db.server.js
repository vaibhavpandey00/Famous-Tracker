import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  // In production, create a new instance
  prisma = new PrismaClient({
    log: [ 'warn', 'error' ],
  });
  console.log("PrismaClient initialized in production.");
} else {
  // In development, use a global variable to prevent creating multiple instances
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: [ 'warn', 'error' ],
    });
    console.log("PrismaClient initialized in development (global).");
  }
  prisma = global.prisma;
}

async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log("Prisma connected to MongoDB Atlas successfully!");
  } catch (error) {
    console.error("Prisma failed to connect to MongoDB Atlas on startup:", error);
    // Depending on your error handling strategy, you might want to
    // re-throw the error or implement a retry mechanism here.
    // For now, logging is sufficient to diagnose.
    throw error; // Re-throw to prevent app from starting with no DB connection
  }
}

// Call the connect function immediately.
// We'll export a promise that resolves when connected.
const prismaConnectionPromise = connectPrisma();

export default prisma;
export { prismaConnectionPromise }; // Export the promise for external use if needed