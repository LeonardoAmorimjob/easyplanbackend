import Notificacao from '../EsquemasMongo/Notificacao';
import Usuario from '../Entidades/Usuario';

class ControleNotificacao {
  async listar(req, res) {
    const verificaprestador = await Usuario.findOne({
      where: {
        id: req.idUsuario,
        prestador: true,
      },
    });
    if (!verificaprestador) {
      return res
        .status(400)
        .json({ error: 'necessario ser prestador de serviços' });
    }
    const notificacoes = await Notificacao.find({
      usuarioId: req.idUsuario,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    return res.json(notificacoes);
  }

  async atualizar(req, res) {
    const notificacao = await Notificacao.findByIdAndUpdate(
      req.params.id,
      {
        lida: true,
      },
      { new: true }
    );
    return res.json(notificacao);
  }
}

export default new ControleNotificacao();
