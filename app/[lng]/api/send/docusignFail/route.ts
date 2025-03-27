import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { songName, recipients } = await request.json();

  try {
    const { data, error } = await resend.emails.send({
        from: 'Mesa <contracts@mesawallet.io>',
        to: ['nick@mesawallet.io'],
        subject: 'Docusign failed for song: '+songName,
        html: `<p>${JSON.stringify(recipients)}</p>`,
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
