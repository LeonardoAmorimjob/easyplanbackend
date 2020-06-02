import * as Yup from 'yup';
import Usuario from '../Entidades/Usuario';
import Arquivo from '../Entidades/Arquivo';

class ControledeUsuario {
  async listar(req, res) {
    const { page } = req.query;
    const usuarios = await Usuario.findAll({
      order: ['id'],
      attributes: ['id', 'nome', 'email', 'prestador'],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(usuarios);
  }

  async criar(req, res) {
    const Esquema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string().email().required(),
      senha: Yup.string().required().min(6),
    });

    if (!(await Esquema.isValid(req.body))) {
      return res.status(400).json({ error: 'falha ao validar os dados.' });
    }
    const usuarioExistente = await Usuario.findOne({
      where: { email: req.body.email },
    });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'e-mail já cadastrado' });
    }
    const { id, nome, email, prestador } = await Usuario.create(req.body);
    return res.json({
      id,
      nome,
      email,
      prestador,
    });
  }

  async atualizar(req, res) {
    const Esquema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      senhaAntiga: Yup.string().min(6),
      senha: Yup.string().when('senhaAntiga', (senhaAntiga, field) =>
        senhaAntiga ? field.required() : field
      ),
      confirSenha: Yup.string().when('senha', (senha, field) =>
        senha ? field.required().oneOf([Yup.ref('senha')]) : field
      ),
    });

    if (!(await Esquema.isValid(req.body))) {
      return res.status(400).json({ error: 'falha ao validar os dados.' });
    }
    const { email, senhaAntiga } = req.body;
    const usuario = await Usuario.findByPk(req.idUsuario);
    if (email && email !== usuario.email) {
      const usuarioExistente = await Usuario.findOne({
        where: { email },
      });
      if (usuarioExistente) {
        return res.status(400).json({ error: 'e-mail já cadastrado' });
      }
    }
    if (senhaAntiga && !(await usuario.verificaSenha(senhaAntiga))) {
      return res.status(400).json({ error: 'senha antiga não confere' });
    }
    await usuario.update(req.body);
    const { id, nome, avatar } = await Usuario.findOne({
      where: { email },
      include: [
        { model: Arquivo, as: 'avatar', attributes: ['id', 'caminho', 'url'] },
      ],
    });
    return res.json({
      id,
      nome,
      email,
      avatar,
    });
  }
}
export default new ControledeUsuario();
