import generateJWT from '../../../../utils/generateJWT';
import generateAccessToken from '../../../utils/generateAccessToken';
import sendDocusign from '../../../utils/sendDocusign';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const token = generateJWT();
        const accessToken = await generateAccessToken(jwt);
        const response = await sendDocusign(accessToken);
  
      return NextResponse.json({ token: token });
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
    }
  }