import { generateEmailTemplate } from "./generic.template";

export const resetPasswordEmail = (name: string, code: string) => {
  const textContent = `
  Someone, hopefully you, requested a password reset for your account.
    *${code}*

    Code expires in 30 minutes.

    If you did not request a password reset, you can safely ignore this email. Only a person with access to your email can reset your account password.
  `;

  const htmlContent = `
    <!-- Title -->
      <p style="font-size: 32px; color: #000000">
        Password Reset
      </p>
    <!-- Email Text -->

      <p style="font-size: 16px; text-align: center">
        Someone, hopefully you, requested a password reset for your account.
      </p>

      <div style="padding:0;padding-bottom: 10px;">
        <p style="font-weight: bold; font-size: 24px">${code}</p>
      </div>

    <!-- Remainder text -->

      <div style="padding:0;padding-bottom: 10px;">
        <p style="color: red">Code expires in 30 minutes.</p>
      </div>


    <div style="padding:0;">
      <p style="
          text-align: center;
          color: #babfca;
          font-size: 14px;
        ">
        If you did not request a password reset, you can safely
        ignore this email. Only a person with access to your email
        can reset your account password.
      </p>
    </div>
  `;

  return {
    subject: "Password Reset",
    ...generateEmailTemplate(htmlContent, textContent),
  };
};
