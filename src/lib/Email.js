import nodmailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nmhbs from 'nodemailer-express-handlebars';
import configEmail from '../Config/Email';

class Email {
  constructor() {
    const { host, port, secure, auth } = configEmail;
    this.transporter = nodmailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });
    this.configuraTemplete();
  }

  configuraTemplete() {
    const caminhoTelas = resolve(
      __dirname,
      '..',
      'Aplicacao',
      'Telas',
      'Emails'
    );
    this.transporter.use(
      'compile',
      nmhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(caminhoTelas, 'layouts'),
          partialsDir: resolve(caminhoTelas, 'partials'),
          defaultLayout: 'padrao',
          extname: '.hbs',
        }),
        viewPath: caminhoTelas,
        extName: '.hbs',
      })
    );
  }

  enviaEmail(mensagem) {
    // console.log(configEmail);
    // console.log('separa mensagem');
    // console.log(mensagem);
    return this.transporter.sendMail({
      ...configEmail,
      ...mensagem,
    });
  }
}
export default new Email();
