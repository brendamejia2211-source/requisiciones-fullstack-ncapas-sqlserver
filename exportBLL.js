const requisitionDAL = require('../dal/requisitionDAL');

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`;
}

async function buildMetricsCsv() {
  const rows = await requisitionDAL.findAllForExport();
  const total = rows.length;
  const amount = rows.reduce((sum, row) => sum + Number(row.estimatedAmount), 0);
  const pending = rows.filter(row => row.status === 'pendiente').length;

  const lines = [
    ['Métrica', 'Valor'],
    ['Total de solicitudes', total],
    ['Monto total acumulado', amount.toFixed(2)],
    ['Solicitudes pendientes', pending],
    [],
    ['Código', 'Título', 'Creador', 'Monto', 'Prioridad', 'Estado', 'Fecha', 'Comentario administrador']
  ];

  rows.forEach(row => lines.push([
    row.code,
    row.title,
    row.createdBy.username,
    Number(row.estimatedAmount).toFixed(2),
    row.priority,
    row.status,
    row.createdAt.toISOString(),
    row.adminComment || ''
  ]));

  return '\ufeff' + lines.map(line => line.map(csvCell).join(',')).join('\n');
}

module.exports = { buildMetricsCsv };
