const { Service } = require("feathers-mongoose");
const nodemailer = require("nodemailer");

exports.Mailer = class Mailer extends Service {
  async create(data, params) {
    const { email, firstName, lastName } = data;
    const code = Math.floor(Math.random() * 1000000);
    const transport = nodemailer.createTransport({
      service: "Gmail",
      port: 465,
      auth: {
        user: process.env.SECRET_EMAIL,
        pass: process.env.SECRET_PASSWORD,
      },
      authMethod: "PLAIN",
    });
    try {
      await transport.sendMail({
        from: process.env.SECRET_EMAIL,
        to: email,
        subject: "Verify message from ducation web app",
        html: `<div>
                <h1>Verify code</h1>
                <h2>Hello ${firstName} ${lastName}</h2>
                <p>Thank you for have an account in education app. Here is your verify code: </p>
                <p>${code}</p>
            </div>`,
      });
      return await super.create({ ...data, verifyCode: code }, params);
    } catch (err) {
      return err;
    }
  }
};
