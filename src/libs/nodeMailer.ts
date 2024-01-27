"use server";

import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

const transporter = nodemailer.createTransport({
  host: process.env.DISCOURSE_SMTP_ADDRESS,
  port: 587,
  secure: false,
  auth: {
    user: process.env.DISCOURSE_SMTP_USER_NAME,
    pass: process.env.DISCOURSE_SMTP_PASSWORD,
  },
});

export async function sendConfirmationEmail(email: string, token: string) {
  const url = process.env.MAIN_DOMAIN_URL ?? "http://localhost:3000";
  try {
    const confirmationLink = `${url}/ndis-verification?token=${token}`;

    const mailOptions: MailOptions = {
      from: "admin@disabilityforums.com.au",
      to: email,
      subject: "NDIS-Verification",
      html: `Click <a href="${confirmationLink}">here</a> to verify as a NDIS Provider.`,
      text: "Please verify by visiting this link. ",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return { success: false, msg: "Error" };
      } else {
        console.log(info);
        console.log(info.response);
        return { success: true, msg: "Success" };
      }
    });
  } catch (error) {
    return { success: false, msg: "Error" };
  }
}
