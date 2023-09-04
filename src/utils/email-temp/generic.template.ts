// TODO: add email styles here

export const generateEmailTemplate = (
  htmlContent: string,
  textContent = "",
) => {
  const html = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password reset</title>
      <style type="text/css">
        @media screen and (max-width: 600px) {
        }
      </style>
    </head>
    <body style="margin:0;background-color:#f6f5ff;">
      <center class="wrapper" style="width:100%;table-layout:fixed;">
        ${htmlContent}
      </center>
    </body>
    </html>
    `;

  const text = textContent;

  return {
    html,
    text,
  };
};
