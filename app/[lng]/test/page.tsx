"use client";
import { useEffect, useState } from 'react';


const Test = () => {
  // eslint-disable-next-line
  const [emails, setEmails] = useState<any[]>([]);
  // eslint-disable-next-line
  const [emailDetails, setEmailDetails] = useState<any | null>(null);


  async function handleASCAP() {
    console.log("nothing")
  }

  useEffect(() => {
    const fetchEmails = async () => {
      const response = await fetch('/en/api/auth/messages');
      const data = await response.json();

      if (data.error) {
        console.error('Error fetching emails:', data.error);
      } else {
        setEmails(data); 
      }
    };

    fetchEmails();
  }, []);

  // Fetch email details only when `emails` changes
  useEffect(() => {
    const fetchDetails = async () => {
      for (const email of emails) {
        await fetchEmailDetails(email.id);
      }
    };

    if (emails.length > 0) {
      fetchDetails();
    }
  }, [emails]);

  const fetchEmailDetails = async (id: string) => {
    const response = await fetch(`/en/api/auth/${id}`);
    const data = await response.json();
    setEmailDetails(data);
    await handleASCAP();
  };

  

  return (
    <div className="p-4 sm:p-8 flex flex-col justify-between">
      <main>
      
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Gmail API Integration</h1>
        <a
          href="/en/api/auth"
          className="bg-blue-500 text-white px-4 py-0 rounded-lg"
        >
          Login with Google
        </a>
        <br/>
        {emailDetails && (
          <p>2FA CODE: {emailDetails.code2fa!}</p>
        )}
      </div>
      </main>
    </div>
  );
};

export default Test;
