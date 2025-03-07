import { Pinecone } from '@pinecone-database/pinecone'

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

export async function POST(request) {
    const { message } = await request.json();

      const assistant = pc.Assistant("passman");

      const chatResp = await assistant.chat({
        messages: [{ role: 'user', content: message }],
      });
      console.log(chatResp);
      return Response.json(chatResp);
}