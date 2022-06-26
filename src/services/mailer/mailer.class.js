const { Service } = require("feathers-mongoose");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

exports.Mailer = class Mailer extends Service {
  async create(data, params) {
    const { email, firstName, lastName } = data;
    const code = Math.random()
      .toString()
      .slice(2, 2 + 6);
    const OAuth2 = google.auth.OAuth2;
    const OAuth2_client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    OAuth2_client.setCredentials({
      refresh_token: process.env.GOOGLE_EMAIL_RF_TOKEN,
    });
    const accessToken = await OAuth2_client.getAccessToken();
    console.log(accessToken.token);
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.SECRET_EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_EMAIL_RF_TOKEN,
        accessToken: accessToken.token,
      },
    });
    try {
      await transport.sendMail({
        from: process.env.SECRET_EMAIL,
        to: email,
        subject: "Verify message from Education web app",
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
