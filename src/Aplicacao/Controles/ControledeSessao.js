import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import Usuario from '../Entidades/Usuario';
import Arquivo from '../Entidades/Arquivo';
import auth from '../../Config/authSessao';

class ControledeSessao {
  async criar(req, res) {
    const esquema = Yup.object().shape({
      email: Yup.string().email().required(),
      senha: Yup.string().required(),
    });

    if (!(await esquema.isValid(req.body))) {
      return res.status(400).json({ error: 'falha ao validar os dados.' });
    }

    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({
      where: { email },
      include: [
        { model: Arquivo, as: 'avatar', attributes: ['id', 'caminho', 'url'] },
      ],
    });
    // console.log(usuario, email);
    if (!usuario) {
      return res.status(401).json({ error: 'usuario invalido' });
    }
    //   console.log(senha);
    if (!(await usuario.verificaSenha(senha))) {
      return res.status(401).json({ error: 'senha invalida' });
    }
    const { id, nome, avatar, prestador } = usuario;
    return res.json({
      usuario: {
        id,
        nome,
        email,
        avatar,
        prestador,
      },
      token: jwt.sign({ id }, auth.segredo, {
        expiresIn: auth.expiraEm,
      }),
    });
  }
}
export default new ControledeSessao();
