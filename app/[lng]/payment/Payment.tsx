"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useDynamicPageStore from "../store/use[page]";
import useQuestion1 from "../store/useQuestion1";
import useQuestion2 from "../store/useQuestion2";
import { useTranslation } from "@/app/i18n/client";
import { NextResponse } from "next/server";

const Payment = ({
  params,
}: {
  params: {
    lng: string;
  };
}) => {
  const { lng } = params;
  const { t } = useTranslation(lng, "confirmation");
  const query = useSearchParams();
  const paid = query.get("success");

  const [message, setMessage] = useState("");

  const cid = useQuestion1((state) => state.cid);
  const song = useQuestion2((state) => state.song);
  const pages = useDynamicPageStore((state) => state.pages);
  const splitType = useQuestion1((state) => state.splitType);
  
  const names = Object.values(pages).map((item) => item.legalName);
  const emails = Object.values(pages).map((item) => item.email);
  
  console.log("in payment:",cid, song, names, emails)


  const sendEmail = async (songName: string, cid:string) => {
    try {
      const response = await fetch(`/${lng}/api/sendPaid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songName: songName, cid: cid }),
      });
      if (!response.ok) {
        console.error("Error sending email:", response.statusText);
        return NextResponse.json(
          { error: "Error sending email" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Error sending email" },
        { status: 500 }
      );
    }
  };

  useEffect(() => {
    const sendDocusign = async () => {
      const response = await fetch(`/en/api/docusign`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ songName: song, cid: cid, names: names, emails: emails, splitType: splitType, lng: lng }),
          });

      const data = await response.json();
      console.log(data)
      };
    if (paid === "true") {
      if(song!=="test"){
        sendEmail(song, cid);
      }
      sendDocusign();
      setMessage(t("1"));
    } else {
      setMessage(t("2"));
    }
  }, [ cid]);



  return (
    <div className=" p-4 sm:p-8 flex flex-col justify-between">
      <main>
        <div className="w-full sm:w-1/2 p-4 sm:p-8 flex flex-col justify-center">
          <p className="text-lg sm:text-xl mb-8">{t("3")}</p>
          <div className="text-base sm:text-lg">{message}</div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
