const sendMail = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define Mail Options
  const mailOptions = {
    from: "Support < support@folio.io >",
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  //   Send the Mail
  await transporter.sendMail(mailOptions);
};

export default sendMail;
