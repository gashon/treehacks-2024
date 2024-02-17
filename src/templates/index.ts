import { EmailTemplate } from "@/types";
import { senderEmail } from "@/lib/aws-sdk";

export const loginTemplate: EmailTemplate = {
  from: senderEmail,
  subject: "Login to ChainGuard",
  content: `
    <div>
      Your login link for ChainGuard
      <br /><br />
      <a href="{{{ login_link }}}">Continue to ChainGuard</a>
      <br /><br />
      This link and code will only be valid for the next 5 minutes. If the link
      does not work, contact support at @ ChainGuard.
    </div>`,
  args: {
    login_link: undefined,
  },
};
