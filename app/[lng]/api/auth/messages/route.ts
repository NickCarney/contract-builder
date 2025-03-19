import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET() {
  const token = cookies().get('gmail_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  oauth2Client.setCredentials({ access_token: token });
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  try {
    //get the most recent ascap security code
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 1,
      q: 'subject:Your one-time ASCAP security code'
    });

    const messages = response.data.messages || [];

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}
