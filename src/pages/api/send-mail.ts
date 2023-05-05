import { NextApiRequest, NextApiResponse } from "next";
import { render } from "@react-email/render";
import { Email } from "~/components/Email";
import { mailOptions, transporter } from "~/utils/nodemailer";

type Response = {
  status: string;
};

interface Request extends NextApiRequest {
  body: {
    /*         name: string;
        email: string; */
  };
}

export default async function sendMail(
  req: Request,
  res: NextApiResponse<Response>
) {
  const emailHtml = render(Email({ url: "https://example.com" }));

  try {
    await transporter.sendMail({
      ...mailOptions,
      subject: "hello world",
      html: emailHtml,
    });

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({ status: "error" });
  }
}
