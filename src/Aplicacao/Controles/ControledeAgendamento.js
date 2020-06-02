import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Agendamentos from '../Entidades/Agendementos';
import Notificacao from '../EsquemasMongo/Notificacao';
import Usuario from '../Entidades/Usuario';
import Arquivo from '../Entidades/Arquivo';
import Queue from '../../lib/Queue';
import EmailCancelado from '../trabalhos/EmailCancelado';

class ControledeAgendamento {
  async listar(req, res) {
    const { page } = req.query;
    const agendamentos = await Agendamentos.findAll({
      where: {
        id_usuario: req.idUsuario,
        canceled_at: null,
      },
      order: ['data'],
      attributes: ['id', 'data', 'passado', 'cancelavel','canceled_at'],
      limit: 20,
     // offset: (page - 1) * 20,

      include: [
        {
          model: Usuario,
          as: 'prestador',
          attributes: ['id', 'nome'],
          include: [
            {
              model: Arquivo,
              as: 'avatar',
              attributes: ['nome', 'caminho', 'url'],
            },
          ],
        },
        {
          model: Usuario,
          as: 'Usuario',
          attributes: ['id', 'nome'],
          include: [
            {
              model: Arquivo,
              as: 'avatar',
              attributes: ['nome', 'caminho', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(agendamentos);
  }

  async criar(req, res) {
    const esquema = Yup.object().shape({
      id_prestador: Yup.number().required(),
      data: Yup.date().required(),
    });

    if (!(await esquema.isValid(req.body))) {
      return res.status(400).json({ error: 'falha ao validar os dados.' });
    }
    const { id_prestador, data } = req.body;
    const eprestador = await Usuario.findOne({
      where: {
        id: id_prestador,
        prestador: true,
      },
    });
    if (!eprestador) {
      return res.status(400).json({ error: 'id não é de um prestador' });
    }
    if (id_prestador === req.idUsuario) {
      return res
        .status(400)
        .json({ error: 'usuario não pode ser igaul ao prestador' });
    }

    const horaInicial = startOfHour(parseISO(data));
    const horaAtual = new Date();
    if (isBefore(horaInicial, horaAtual)) {
      return res
        .status(400)
        .json({ error: `escolha uma hora superioe a ${horaAtual}` });
    }
    const indisponivel = await Agendamentos.findOne({
      where: {
        id_prestador,
        canceled_at: null,
        data: horaInicial,
      },
    });
    if (indisponivel) {
      return res.status(400).json({ error: 'horario indisponivel' });
    }

    const agendamento = await Agendamentos.create({
      id_usuario: req.idUsuario,
      id_prestador,
      data: horaInicial,
    });
    const dataFormatada = format(
      horaInicial,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );
    const usuario = await Usuario.findByPk(req.idUsuario);
    await Notificacao.create({
      conteudo: `Novo agendamento de ${usuario.nome} para ${dataFormatada}`,
      usuarioId: id_prestador,
    });

    return res.json(agendamento);
  }

  async deletar(req, res) {
    const agendamento = await Agendamentos.findByPk(req.params.id, {
      include: [
        {
          model: Usuario,
          as: 'prestador',
          attributes: ['nome', 'email'],
        },
        {
          model: Usuario,
          as: 'Usuario',
          attributes: ['nome'],
        },
      ],
    });
    // console.log(agendamento.Usuario.nome);

    if (agendamento.id_usuario !== req.idUsuario) {
      return res.status(401).json({
        error: 'sem permissao para deletar esse agendamento',
      });
    }
    const agendamentoL2H = subHours(agendamento.data, 2);
    if (isBefore(agendamentoL2H, new Date())) {
      return res
        .status(401)
        .json(
          'agendamento só pode ser cancelado com o minimo de duas horas de antecedencia'
        );
    }
    agendamento.canceled_at = new Date();
    await agendamento.save();
   // await Queue.add(EmailCancelado.key, agendamento);
    return res.json(agendamento);
  }
}
export default new ControledeAgendamento();
