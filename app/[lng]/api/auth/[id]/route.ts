import { google } from 'googleapis';
import { cookies } from 'next/headers';
import {  NextResponse } from 'next/server';
import { chromium } from "playwright";

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// Handle the dynamic route
export async function GET( { params }: { params: { id: string } }) {

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://www.ascap.com/member-access#login");

    const iframes = await page.frames();
    console.log('Found iFrames:', iframes.length);
    for (const frame of iframes) {
        console.log('Frame URL:', frame.url());
    }
    const iframe = page.frame({ url: /consent\.trustarc\.com/ });
    await iframe?.locator('a.call').click();

    // Enter credentials  
    await page.fill('input[name="username"]', process.env.ASCAP_EMAIL!);
    await page.fill('input[name="password"]', process.env.ASCAP_PASSWORD!);
    await page.waitForTimeout(3000);
    // await page.click('button[type="submit"]');

    // await page.click('input[type="radio"]');
    // await page.click('button[type="submit"]');

    await page.waitForTimeout(5000);//5s
    // // Wait for 2FA input field
    // await page.waitForSelector('input[name="otp"]');
    // console.log("Waited for 2fa")


  const cookieStore = cookies();
  const token = cookieStore.get('gmail_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  oauth2Client.setCredentials({ access_token: token });

  // Extract the 'id' directly from the dynamic route
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Email ID is required' }, { status: 400 });
  }

  try {
    // Fetch the email using its ID
    const res = await gmail.users.messages.get({
      userId: 'me',
      id,
    });

    const emailHeaders = res.data.payload!.headers;
    const subject = emailHeaders!.find((header) => header.name === 'Subject')?.value;
    const from = emailHeaders!.find((header) => header.name === 'From')?.value;

    let emailBody = '';
    const parts = res.data.payload!.parts;

    if (parts) {
      for (const part of parts) {
        if (part.mimeType === 'text/plain') {
          emailBody = part.body!.data
            ? Buffer.from(part.body!.data, 'base64').toString('utf-8')
            : '';
        } else if (part.mimeType === 'text/plain') {
          emailBody = part.body!.data
            ? Buffer.from(part.body!.data, 'base64').toString('utf-8')
            : '';
        }
      }
    }
    
    const index = emailBody.indexOf("This code is valid for five (5) minutes");
    const code2fa = emailBody.slice(index-8,index-1);


    // await page.fill('input[name="otp"]', code2fa);
    // await page.click('button[type="submit"]');






    if (!emailBody && res.data.payload!.body?.data) {
      emailBody = Buffer.from(res.data.payload!.body.data, 'base64').toString('utf-8');
    }

    return NextResponse.json({
      subject,
      from,
      body: emailBody,
      code2fa,
    });
  } catch (error: any) {
    console.error('Error fetching email:', error);
    console.error('Error details:', error.response?.data);
    return NextResponse.json({ error: 'Failed to fetch email' }, { status: 500 });
  }
}
