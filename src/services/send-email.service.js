import nodemailer from "nodemailer";

export const sendEmailService = async ({
  to,
  subject = "Job Search App",
  textMessage = "",
  htmlMessage = "",
  attachments = [],
} = {}) => {

  // configer email ( transporter)
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 465,
    secure: true,
    auth: {
      user: "minatawfikm@gmail.com",
      pass: "hddeynjfctrmjxkm",
    },
    service: "gmail"
  })

  // configer mail
  const info = await transporter.sendMail({
    from: "Job Search App Confirmation <minatawfikm@gmail.com>",
    to,
    subject,
    text: textMessage,
    html: htmlMessage,
    attachments,
  });
  
  return info;
};
