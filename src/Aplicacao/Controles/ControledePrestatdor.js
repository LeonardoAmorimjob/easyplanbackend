import Usuario from '../Entidades/Usuario';
import Arquivo from '../Entidades/Arquivo';

class ControledePrestador {
  async listar(req, res) {
    const prestadores = await Usuario.findAll({
      where: { prestador: true },
      attributes: ['id', 'nome', 'email', 'avatar_id'],
      include: {
        model: Arquivo,
        as: 'avatar',
        attributes: ['nome', 'caminho', 'url'],
      },
    });
    return res.json(prestadores);
  }
}
export default new ControledePrestador();
