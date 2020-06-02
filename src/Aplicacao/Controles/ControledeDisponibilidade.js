import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Agendamentos from '../Entidades/Agendementos';

class ControledeDisponibilidade {
  async listar(req, res) {
    const { data } = req.query;
    if (!data) {
      return res.status(400).json({ error: 'data incalida' });
    }
    const localizarData = Number(data);
    const agendamento = await Agendamentos.findAll({
      where: {
        id_prestador: req.params.idPrestador,
        canceled_at: null,
        data: {
          [Op.between]: [startOfDay(localizarData), endOfDay(localizarData)],
        },
      },
    });
    const agenda = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ];
    const disponivel = agenda.map((time) => {
      const [hora, minuto] = time.split(':');
      const valor = setSeconds(
        setMinutes(setHours(localizarData, hora), minuto),
        0
      );
      return {
        time,
        value: format(valor, "yyy-MM-dd'T'HH:mm:ssxxx"),
        disponivel:
          isAfter(valor, new Date()) &&
          !agendamento.find(
            (agendament) => format(agendament.data, 'HH:mm') === time
          ),
      };
    });
    return res.json(disponivel);
  }
}

export default new ControledeDisponibilidade();
