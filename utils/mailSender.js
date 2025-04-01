import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {
  // console.log("in mailsender",body);
  
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "Shopsy",
      to: email,
      subject: title,
      html: body,
    });

    // console.log(info);
    return info;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default mailSender;
