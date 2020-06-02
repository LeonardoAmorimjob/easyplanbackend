import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Email from '../../lib/Email';

class EmailCancelado {
  get key() {
    return 'EmailCancelado';
  }

  async handle({ data }) {
    const agendamento = data;
    // console.log(agendamento);
    await Email.enviaEmail({
      to: `${agendamento.prestador.nome}<${agendamento.prestador.email}>`,
      subject: 'Agendamento cancelado',
      template: 'Cancelado',
      context: {
        prestador: agendamento.prestador.nome,
        usuario: agendamento.Usuario.nome,
        data: format(
          parseISO(agendamento.data),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new EmailCancelado();
