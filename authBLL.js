const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const userDAL = require('../dal/userDAL');

async function login(payload) {
  const data = z.object({
    username: z.string().trim().min(1),
    password: z.string().min(1)
  }).parse(payload);

  const user = await userDAL.findByUsername(data.username);
  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    const error = new Error('Usuario o contraseña incorrectos');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    user: { id: user.id, username: user.username, role: user.role }
  };
}

module.exports = { login };
