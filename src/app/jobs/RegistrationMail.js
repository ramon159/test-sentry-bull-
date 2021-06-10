import Mail from '../lib/Mail';

export default {
  key: 'RegistrationMail',
  async handle({ data }) {
    const { user: { name, email } } = data;

    await Mail.sendMail({
      from: 'Queue test <queue@test.com>',
      to: `${name} <${email}>`,
      subject: 'Cadastro de usuário',
      html: `Olá, ${name}, seja bem-vindo ao Queue Test`,
    });
  },
};
