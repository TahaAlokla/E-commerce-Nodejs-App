const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // create a transporter email (service that will send emails like gmail , sendGird ,mailGun)
  const mailTransporter = nodemailer.createTransport({
    host: process.env.Email_host,
    port: process.env.Email_port,
    // if secure connection port equal to 465 ,
    // if not secure port equal to '587'
    secure: true,
    auth: {
      user: process.env.Email_user,
      pass: process.env.password_email,
    },
  });
  // define the email options
  const mailOptions = {
    from: `E-taha-App<$${process.env.Email_user}>`,
    to: options.email,
    subject: options.subject,
    text: options.content,
  };
  // send the email
  await mailTransporter.sendMail(mailOptions);
};

module.exports = sendEmail;
