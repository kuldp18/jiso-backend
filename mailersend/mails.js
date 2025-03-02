import { mailerSendClient, sender } from "./mailersend.config.js";
import { Recipient, EmailParams } from "mailersend";

export const sendEmailVerificationEmail = async (user) => {
  try {
    const recipients = [new Recipient(user.email, user.name)];

    const personalization = [
      {
        email: user.email,
        data: {
          code: user.emailVerificationToken,
          name: user.name,
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
