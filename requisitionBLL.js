const { z } = require('zod');
const requisitionDAL = require('../dal/requisitionDAL');

const priorities = ['baja', 'media', 'alta'];
const statuses = ['pendiente', 'aprobado', 'rechazado'];

function validateFilters(query) {
  const { status, priority } = query;
  if (status && !statuses.includes(status)) {
    const error = new Error('Estado inválido'); error.status = 400; throw error;
  }
  if (priority && !priorities.includes(priority)) {
    const error = new Error('Prioridad inválida'); error.status = 400; throw error;
  }
}

async function nextCode() {
  const year = new Date().getFullYear();
  const last = await requisitionDAL.findLastCodeByYear(year);
  const n = last ? Number(last.code.split('-')[2]) + 1 : 1;
  return `REQ-${year}-${String(n).padStart(3, '0')}`;
}

async function list(user, query) {
  validateFilters(query);
  const where = {
    ...(user.role === 'empleado' ? { createdById: Number(user.id) } : {}),
    ...(query.status ? { status: query.status } : {}),
    ...(query.priority ? { priority: query.priority } : {})
  };
  return requisitionDAL.findMany(where);
}

async function create(user, payload) {
  const data = z.object({
    title: z.string().trim().min(3, 'El título debe tener al menos 3 caracteres'),
    estimatedAmount: z.coerce.number().positive('El monto debe ser mayor a 0'),
    priority: z.enum(priorities)
  }).parse(payload);

  return requisitionDAL.create({
    code: await nextCode(),
    title: data.title,
    estimatedAmount: data.estimatedAmount,
    priority: data.priority,
    createdById: Number(user.id)
  });
}

async function approve(id, payload) {
  const current = await requisitionDAL.findById(id);
  if (!current) { const error = new Error('Solicitud no encontrada'); error.status = 404; throw error; }
  if (current.status !== 'pendiente') { const error = new Error('Solo se pueden aprobar solicitudes pendientes'); error.status = 409; throw error; }

  const comment = typeof payload?.comment === 'string' ? payload.comment.trim() : null;
  return requisitionDAL.update(id, { status: 'aprobado', adminComment: comment || null });
}

async function reject(id, payload) {
  const data = z.object({
    comment: z.string().trim().min(1, 'El comentario de rechazo es obligatorio')
  }).parse(payload);

  const current = await requisitionDAL.findById(id);
  if (!current) { const error = new Error('Solicitud no encontrada'); error.status = 404; throw error; }
  if (current.status !== 'pendiente') { const error = new Error('Solo se pueden rechazar solicitudes pendientes'); error.status = 409; throw error; }

  return requisitionDAL.update(id, { status: 'rechazado', adminComment: data.comment });
}

async function addAttachments(user, id, files) {
  const requisition = await requisitionDAL.findById(id);
  if (!requisition) { const error = new Error('Solicitud no encontrada'); error.status = 404; throw error; }
  if (requisition.createdById !== Number(user.id)) { const error = new Error('No puedes adjuntar archivos a esta solicitud'); error.status = 403; throw error; }

  const items = (files || []).map(file => ({
    originalName: file.originalname,
    storedName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    requisitionId: id
  }));

  const result = await requisitionDAL.createAttachments(items);
  return { count: result.count, message: 'Adjuntos cargados' };
}

module.exports = { list, create, approve, reject, addAttachments };
