import Arquivo from '../Entidades/Arquivo';

class ControledeArquivo {
  async criar(req, res) {
    const { originalname: nome, filename: caminho } = req.file;
    const arquivo = await Arquivo.create({
      nome,
      caminho,
    });
    return res.json(arquivo);
  }
}
export default new ControledeArquivo();
