import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Agendamentos extends Model {
  static init(sequelize) {
    super.init(
      {
        data: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        passado: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.data, new Date());
          },
        },
        cancelavel: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.data, 2));
          },
        },
      },
      { sequelize }
    );

    return this;
  }

  static associate(entidades) {
    this.belongsTo(entidades.Usuario, {
      foreignKey: 'id_usuario',
      as: 'Usuario',
    });
    this.belongsTo(entidades.Usuario, {
      foreignKey: 'id_prestador',
      as: 'prestador',
    });
  }
}
export default Agendamentos;
