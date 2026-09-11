const prisma = require('../config/prisma');

const include = {
  createdBy: { select: { id: true, username: true } },
  attachments: true
};

async function findMany(where = {}) {
  return prisma.requisition.findMany({
    where,
    include,
    orderBy: { createdAt: 'desc' }
  });
}

async function findById(id) {
  return prisma.requisition.findUnique({ where: { id }, include });
}

async function findLastCodeByYear(year) {
  return prisma.requisition.findFirst({
    where: { code: { startsWith: `REQ-${year}-` } },
    orderBy: { id: 'desc' }
  });
}

async function create(data) {
  return prisma.requisition.create({ data, include });
}

async function update(id, data) {
  return prisma.requisition.update({ where: { id }, data, include });
}

async function createAttachments(data) {
  return prisma.attachment.createMany({ data });
}

async function findAllForExport() {
  return prisma.requisition.findMany({
    include: { createdBy: { select: { username: true } } },
    orderBy: { createdAt: 'desc' }
  });
}

module.exports = {
  findMany,
  findById,
  findLastCodeByYear,
  create,
  update,
  createAttachments,
  findAllForExport
};
