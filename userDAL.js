const prisma = require('../config/prisma');

async function findByUsername(username) {
  return prisma.user.findUnique({ where: { username } });
}

module.exports = { findByUsername };
