const requisitionBLL = require('../bll/requisitionBLL');

async function list(req, res, next) {
  try { res.json(await requisitionBLL.list(req.user, req.query)); } catch (error) { next(error); }
}

async function create(req, res, next) {
  try { res.status(201).json(await requisitionBLL.create(req.user, req.body)); } catch (error) { next(error); }
}

async function approve(req, res, next) {
  try { res.json(await requisitionBLL.approve(Number(req.params.id), req.body)); } catch (error) { next(error); }
}

async function reject(req, res, next) {
  try { res.json(await requisitionBLL.reject(Number(req.params.id), req.body)); } catch (error) { next(error); }
}

async function addAttachments(req, res, next) {
  try { res.status(201).json(await requisitionBLL.addAttachments(req.user, Number(req.params.id), req.files)); } catch (error) { next(error); }
}

module.exports = { list, create, approve, reject, addAttachments };
