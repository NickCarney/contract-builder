'use client'
// pages/index.js
import { useEffect, useState } from 'react';
import useQuestion1 from '../store/useQuestion1'
import useQuestion2 from "../store/useQuestion2";
import useDynamicPageStore from "../store/use[page]";


export default function Home() {
  const [token, setToken] = useState('');
  const cid = useQuestion1((state) => state.cid);
  const song = useQuestion2.getState().song;
  const pages = useDynamicPageStore.getState().pages;
  
  const names = Object.values(pages).map((item) => item.legalName);
  const emails = Object.values(pages).map((item) => item.email);
  
  console.log(cid, song, names, emails)

  useEffect(() => {
    const fetchToken = async () => {
            const response = await fetch(`/en/api/docusign`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ songName: song, cid: cid, names: names, emails: emails }),
                });


            //   const response = await fetch('/en/api/docusign');
            const data = await response.json();
            console.log(data)
            setToken(data.response);
            };
        fetchToken();
  }, [cid]);

  return (
    <div>
      {/* <a href={`https://account-d.docusign.com/oauth/auth?
      response_type=code
      &scope=manage_app_keys%20signature%20openid%20cors%20click.manage%20click.send%20organization_read%20group_read%20permission_read%20user_read%20user_write%20account_read%20domain_read%20identity_provider_read%20user_data_redact%20dtr.rooms.read%20dtr.rooms.write%20dtr.documents.read%20dtr.documents.write%20dtr.profile.read%20dtr.profile.write%20dtr.company.read%20dtr.company.write%20room_forms%20notary_write%20notary_read%20spring_read%20spring_write%20webforms_read%20webforms_instance_read%20webforms_instance_write%20aow_manage%20adm_store_unified_repo_read%20impersonation
      &client_id=${process.env.DOCUSIGN_CLIENT_ID}
      &redirect_uri=${process.env.DOCUSIGN_REDIRECT_URI}`}>Get Docusign consent</a> */}
      <h1>Your access Token</h1>
      <p>{token}</p>
    </div>
  );
}
