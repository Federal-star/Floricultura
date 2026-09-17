const { PrismaClient } = require('@prisma/client');
const env = require('./env');

const globalForPrisma = global;

const prisma =
  globalForPrisma.prismaClient ||
  new PrismaClient({
    datasources: {
      db: {
        url: env.databaseUrl
      }
    }
  });

if (env.nodeEnv !== 'production') {
  globalForPrisma.prismaClient = prisma;
}

module.exports = prisma;
