import { APP_NAME } from "../constants";
import { EmailOpts } from "./../../interfaces";
import { generateEmailTemplate } from "./generic.template";

export const welcomeTemplate = ({ name }): Omit<EmailOpts, "from" | "to"> => {
  const htmlContent = `
    <h3>Hello ${name}!</h3>

    <p>Welcome to [${APP_NAME}].</p>
    <br><br>
    <p>Here are some tips to get started:</p>
  `;

  const textContent = `
    Hello ${name}!

    Welcome to [${APP_NAME}]. 
    `;

  return {
    subject: `Welcome to [${APP_NAME}]`,
    ...generateEmailTemplate(htmlContent, textContent),
  };
};
