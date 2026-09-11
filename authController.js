const authBLL = require('../bll/authBLL');

async function login(req, res, next) {
  try {
    res.json(await authBLL.login(req.body));
  } catch (error) { next(error); }
}

module.exports = { login };
