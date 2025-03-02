import dotenv from "dotenv";
import { MailerSend, Sender } from "mailersend";

dotenv.config();

export const mailerSendClient = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

export const sender = new Sender(process.env.EMAIL_DOMAIN_NAME, "Jiso");
