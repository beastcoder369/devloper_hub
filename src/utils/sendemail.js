import { SendEmailCommand } from "@aws-sdk/client-ses";
import { sesClient } from "./sesClients.js";

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
  });
};

const run = async (subject, body) => {
  if (!subject || !body) {
    console.warn("[sendemail] Subject and body are required");
    return null;
  }

  const to = process.env.TO_EMAIL;
  const from = process.env.FROM_EMAIL;

  if (!to || !from) {
    console.warn("[sendemail] Missing FROM_EMAIL or TO_EMAIL environment variables; skipping send.");
    return null;
  }

  const sendEmailCommand = createSendEmailCommand(to, from, subject, body);

  try {
    const response = await sesClient.send(sendEmailCommand);
    console.log("✅ Email sent:", response.MessageId || response);
    return response;
  } catch (error) {
    console.error("❌ SES Error:", error && error.message ? error.message : error);

    if (error && error.name === "MessageRejected") {
      console.error("⚠️ Email rejected by SES:", error.message);
    }

    // return null on failure so callers can continue without throwing
    return null;
  }
};

export { run };