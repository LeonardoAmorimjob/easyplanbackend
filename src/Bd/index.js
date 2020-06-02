import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import configBd from '../Config/Bd';
import Usuario from '../Aplicacao/Entidades/Usuario';
import Arquivo from '../Aplicacao/Entidades/Arquivo';
import Agendamentos from '../Aplicacao/Entidades/Agendementos';

const entidades = [Usuario, Arquivo, Agendamentos];

class Bd {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.conexao = new Sequelize(configBd);
    entidades
      .map((entidade) => entidade.init(this.conexao))
      .map(
        (entidade) =>
          entidade.associate && entidade.associate(this.conexao.models)
      );
  }

  mongo() {
    this.conexaoMongo = mongoose.connect(process.env.EXT_MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    });
  }
}
export default new Bd();
