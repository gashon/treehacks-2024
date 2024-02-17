import { SES } from "@/lib/aws-sdk";
import type { EmailTemplate } from "@/types";
import { loginTemplate } from "@/templates";

export const sendEmails = async ({
  emails,
  template,
}: {
  emails: string[];
  template: EmailTemplate & { args: Record<string, string> };
}) => {
  const content = template.content.replace(
    /{{{ ([a-zA-Z0-9_]+) }}}/g,
    (_, key) => {
      const value = template.args[key];

      if (value === undefined) {
        throw new Error(`Missing value for key ${key}`);
      }

      return value;
    },
  );

  const msg = {
    Destination: {
      ToAddresses: emails,
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: content,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: template.subject,
      },
    },
    Source: template.from,
  };
  await SES.sendEmail(msg).promise();
};

export const sendEmail = async ({
  email,
  template,
}: {
  email: string;
  template: EmailTemplate;
}) => {
  const content = template.args
    ? template.content.replace(/{{{ ([a-zA-Z0-9_]+) }}}/g, (_, key) => {
        const value = template.args![key];

        if (value === undefined) {
          throw new Error(`Missing value for key ${key}`);
        }

        return value;
      })
    : template.content;

  const msg = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: content,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: template.subject,
      },
    },
    Source: template.from,
  };
  await SES.sendEmail(msg).promise();
};

export const sendLoginEmail = async ({
  email,
  loginLink,
}: {
  email: string;
  loginLink: string;
}) => {
  await sendEmail({
    email,
    template: {
      ...loginTemplate,
      args: {
        login_link: loginLink,
      },
    },
  });
};
