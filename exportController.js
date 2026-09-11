const exportBLL = require('../bll/exportBLL');

async function metricsCsv(req, res, next) {
  try {
    const csv = await exportBLL.buildMetricsCsv();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="metricas-requisiciones.csv"');
    res.send(csv);
  } catch (error) { next(error); }
}

module.exports = { metricsCsv };
