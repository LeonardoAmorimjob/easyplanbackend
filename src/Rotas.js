import { Router } from 'express';
import multer from 'multer';
import multerConfig from './Config/multer';
import ControleDeUsuario from './Aplicacao/Controles/ControleDeUsuario';
import ControledeSessao from './Aplicacao/Controles/ControledeSessao';
import authUsuario from './Aplicacao/middlewares/authUsuario';
import ControledeArquivo from './Aplicacao/Controles/ControledeArquivo';
import ControledePrestatdor from './Aplicacao/Controles/ControledePrestatdor';
import ControledeAgendamento from './Aplicacao/Controles/ControledeAgendamento';
import AgendamentoPrestador from './Aplicacao/Controles/ControleAgendamentoPrestador';
import ControleNotificacao from './Aplicacao/Controles/ControleNotificacao';
import ControledeDisponibilidade from './Aplicacao/Controles/ControledeDisponibilidade';

const rotas = new Router();
const carregamento = multer(multerConfig);

rotas.post('/usuario', ControleDeUsuario.criar);
rotas.get('/usuario', ControleDeUsuario.listar);
rotas.post('/sessao', ControledeSessao.criar);
rotas.use(authUsuario);
rotas.put('/usuario', ControleDeUsuario.atualizar);
rotas.post(
  '/arquivos',
  carregamento.single('arquivo'),
  ControledeArquivo.criar
);
rotas.get('/prestador', ControledePrestatdor.listar);
rotas.get(
  '/prestador/:idPrestador/disponivel',
  ControledeDisponibilidade.listar
);
rotas.get('/agendamentos', ControledeAgendamento.listar);
rotas.post('/agendamentos', ControledeAgendamento.criar);
rotas.put('/agendamentos/:id', ControledeAgendamento.deletar);

rotas.get('/agenda', AgendamentoPrestador.listarAgenda);
rotas.get('/notificacoes', ControleNotificacao.listar);
rotas.put('/notificacoes/:id', ControleNotificacao.atualizar);

export default rotas;
