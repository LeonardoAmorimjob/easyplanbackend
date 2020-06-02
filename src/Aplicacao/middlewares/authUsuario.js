import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authSessao from '../../Config/authSessao';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json('sem autenticação');
  }
  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authSessao.segredo);
    req.idUsuario = decoded.id;
    // console.log(decoded);
    return next();
  } catch (err) {
    return res.status(401).json('token invalido');
  }
};
