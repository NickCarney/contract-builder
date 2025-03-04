import { Pinecone } from '@pinecone-database/pinecone'

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

export async function POST(request) {
    const { message } = await request.json();

    //creating the assitant
    // const assistant = await pc.createAssistant({
    //     name: 'all-you-need-to-know-about-the-music-business',
    //     instructions: 'Use American English for spelling and grammar. Answer the user\'s questions about the music industry to the best of your ability. If you do not know the answer, do not make one up.',
    //     region: 'us'
    //   });
      const assistant = pc.Assistant("all-you-need-to-know-about-the-music-business");

      //uploading our file to the assitant
      // await assistant.uploadFile({
      //   path: 'app/[lng]/public/passman.txt'
      // });

      const chatResp = await assistant.chat({
        messages: [{ role: 'user', content: message }],
      });
      console.log(chatResp);
      return Response.json(chatResp);
}