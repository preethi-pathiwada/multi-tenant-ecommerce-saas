import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, name, verificationUrl) => {
  const mailOptions = {
    from: `"MarketHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your MarketHub email address",

    html: `
      <div style="
        margin:0;
        padding:40px 20px;
        background:#f1f5f9;
        font-family:Arial,Helvetica,sans-serif;
      ">

        <div style="
          max-width:600px;
          margin:auto;
          background:#ffffff;
          border-radius:24px;
          padding:40px;
          border:1px solid #e2e8f0;
        ">

          <div style="
            width:48px;
            height:48px;
            border-radius:16px;
            background:#0d9488;
            color:white;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:22px;
            font-weight:bold;
            margin-bottom:24px;
          ">
            OK
          </div>

          <h1 style="
            margin:0 0 12px;
            color:#0f172a;
            font-size:28px;
          ">
            Welcome to MarketHub
          </h1>

          <p style="
            color:#475569;
            font-size:15px;
            line-height:1.7;
          ">
            Hi ${name},
          </p>

          <p style="
            color:#475569;
            font-size:15px;
            line-height:1.7;
          ">
            Thanks for creating your OrbiKart account.
            Please verify your email address to activate your account.
          </p>

          <div style="margin:30px 0;">
            <a
              href="${verificationUrl}"
              style="
                display:inline-block;
                padding:14px 24px;
                background:#0d9488;
                color:#ffffff;
                text-decoration:none;
                border-radius:12px;
                font-weight:bold;
              "
            >
              Verify Email Address
            </a>
          </div>

          <p style="
            color:#94a3b8;
            font-size:13px;
            line-height:1.6;
          ">
            This verification link will expire in 24 hours.
          </p>

          <p style="
            color:#94a3b8;
            font-size:12px;
            line-height:1.6;
          ">
            If you did not create this account, you can safely ignore this email.
          </p>

        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};