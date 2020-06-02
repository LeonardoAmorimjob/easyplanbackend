import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Agendamento from '../Entidades/Agendementos';
import Usuario from '../Entidades/Usuario';

class ControleAgendamentoPrestador {
  async listarAgenda(req, res) {
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

    const { data } = req.query;

    const converteData = parseISO(data);
    const agendamentos = await Agendamento.findAll({
      where: {
        id_prestador: req.idUsuario,
        canceled_at: null,
        data: {
          [Op.between]: [startOfDay(converteData), endOfDay(converteData)],
        },
      },
      include: [
        {
          model: Usuario,
          as: 'Usuario',
          attributes: ['nome'],
        },
      ],
      order: ['data'],
    });
 

    return res.status(200).json(agendamentos);
  }
}

export default new ControleAgendamentoPrestador();
