import mongoose from 'mongoose';

const esquemaNotificacao = new mongoose.Schema(
  {
    conteudo: {
      type: String,
      required: true,
    },
    usuarioId: {
      type: Number,
      required: true,
    },
    lida: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Notificacao', esquemaNotificacao);
