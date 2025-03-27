import generateJWT from '../../../utils/generateJWT';
import generateAccessToken from '../../../utils/generateAccessToken';
import sendDocusign from '../../../utils/sendDocusign';

import { NextResponse } from 'next/server';

export async function POST(request) {
    const { songName, cid, names, emails, splitType } = await request.json();
    // console.log("in route:",cid, songName, names, emails, splitType)
    try {
        const jwt = generateJWT();
        const accessToken = await generateAccessToken(jwt);
        const response = await sendDocusign(accessToken, songName, cid, names, emails, splitType);
  
      return NextResponse.json({ response: response });
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
    }
  }

  