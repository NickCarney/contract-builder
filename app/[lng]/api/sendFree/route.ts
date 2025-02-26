import { EmailTemplate } from "../../../components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { songName } = await request.json(); // Assuming the name is sent in the request body

  try {
    const { data, error } = await resend.emails.send({
      from: "Mesa <contracts@mesawallet.io>",
      to: [
        "nick@mesawallet.io",
        "andres@mesawallet.io",
        "thomas@mesawallet.io",
      ],
      subject: "Free Contract Download Successful",
      react: EmailTemplate({ songName }),
    });

    if (error) {
      return Response.json({ error }, { status: 400 });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Resend error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
