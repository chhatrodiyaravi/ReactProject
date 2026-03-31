import nodemailer from "nodemailer";

const getSmtpConfig = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM } =
    process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    return null;
  }

  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true" || Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    from: SMTP_FROM,
  };
};

const getTransport = async () => {
  const smtp = getSmtpConfig();

  if (smtp) {
    return {
      transporter: nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: smtp.auth,
      }),
      from: smtp.from,
      mode: "smtp",
    };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "SMTP config missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.",
    );
  }

  const testAccount = await nodemailer.createTestAccount();

  return {
    transporter: nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    }),
    from: `FoodHub Dev <${testAccount.user}>`,
    mode: "ethereal",
  };
};

export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const transport = await getTransport();

  const recipientName = name || "FoodHub User";

  const info = await transport.transporter.sendMail({
    from: transport.from,
    to,
    subject: "FoodHub Password Reset",
    text: `Hi ${recipientName},\n\nUse this link to reset your password: ${resetUrl}\n\nThis link expires in 15 minutes.\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="color: #ea580c; margin-bottom: 8px;">FoodHub Password Reset</h2>
        <p>Hi ${recipientName},</p>
        <p>Click the button below to reset your password.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background: #ea580c; color: #ffffff; padding: 10px 18px; border-radius: 6px; text-decoration: none; font-weight: 600;">Reset Password</a>
        </p>
        <p>This link expires in <strong>15 minutes</strong>.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  return {
    mode: transport.mode,
    messageId: info.messageId,
    previewUrl: nodemailer.getTestMessageUrl(info) || null,
  };
};
