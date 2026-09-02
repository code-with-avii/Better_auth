import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  url: string
) {
  const { data, error } = await resend.emails.send({
    from: "AuthFlow <auth@avii.in>",
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Verify your email</h2>

      <p>
        Thanks for creating an account.
      </p>

      <p>
        Click the button below to verify your email address.
      </p>

      <a
        href="${url}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#000;
          color:#fff;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Verify Email
      </a>

      <p>
        If you didn't create this account, you can ignore this email.
      </p>
    `,
  });
  if (error) {
    console.error("Resend Error:", error);
    throw new Error(error.message);
  }
  console.log("Verification email sent:", data);
}

export async function sendResetPasswordEmail(
  email: string,
  url: string
) {
  const { data, error } = await resend.emails.send({
    from: "AuthFlow <auth@avii.in>",
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Reset your password</h2>

      <p>
        You requested a password reset. Click the button below to set a new password.
      </p>

      <a
        href="${url}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#000;
          color:#fff;
          text-decoration:none;
          border-radius:6px;
        "
      >
        Reset Password
      </a>

      <p>
        If you didn't request a password reset, you can ignore this email.
      </p>
    `,
  });
  if (error) {
    console.error("Resend Error:", error);
    throw new Error(error.message);
  }
  console.log("Reset password email sent:", data);
}

