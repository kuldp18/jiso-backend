import { mailerSendClient, sender } from "./mailersend.config.js";
import { Recipient, EmailParams } from "mailersend";
import dotenv from "dotenv";

dotenv.config();

export const sendEmailVerificationEmail = async (user) => {
  try {
    const recipients = [new Recipient(user.email, user.fullName)];

    const personalization = [
      {
        email: user.email,
        data: {
          code: user.emailVerificationToken,
          name: user.firstName,
          account: {
            name: "Jiso",
          },
        },
      },
    ];

    const emailParams = new EmailParams()
      .setFrom(sender)
      .setTo(recipients)
      .setReplyTo(sender)
      .setSubject("Verify your email")
      .setPersonalization(personalization)
      .setTemplateId("3z0vklopdk1g7qrx");

    await mailerSendClient.email.send(emailParams);
  } catch (error) {
    console.log(error.message);
  }
};

export const sendPasswordResetEmail = async (user, token) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

  try {
    const recipients = [new Recipient(user.email, user.fullName)];

    const personalization = [
      {
        email: user.email,
        data: {
          link: resetLink,
          name: user.firstName,
          account: {
            name: "Jiso",
          },
        },
      },
    ];

    const emailParams = new EmailParams()
      .setFrom(sender)
      .setTo(recipients)
      .setReplyTo(sender)
      .setSubject("Reset your password")
      .setPersonalization(personalization)
      .setTemplateId("jy7zpl9wzeo45vx6");

    await mailerSendClient.email.send(emailParams);
  } catch (error) {
    console.log(error.message);
  }
};
