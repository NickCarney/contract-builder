"use client";

import React from "react";
import { useRouter } from "next/navigation";
import PDF from "./pdf";
import { useTranslation } from "@/app/i18n/client";
import useQuestion1 from "../../store/useQuestion1";

import { NextResponse } from "next/server";
import useQuestion2 from "../../store/useQuestion2";

const Success = ({
  params,
}: {
  params: {
    lng: string;
  };
}) => {
  const router = useRouter();

  //const downloadUnsignedTrue = PDF(true);
  const downloadUnsignedFalse = PDF(false);
  let cid =
    "https://mesa.mypinata.cloud/ipfs/" + useQuestion1((state) => state.cid);
  const songName = useQuestion2((state) => state.song);
  const { lng } = params;
  const { t } = useTranslation(lng, "master_recording/success");

  React.useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  const sendEmail = async (songName: string, cid:string) => {
    try {
      const response = await fetch(`/${lng}/api/sendFree`, {
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

  const handleFreeDownload = () => {
    downloadUnsignedFalse();
    cid = cid;
    sendEmail(songName, cid);
    document.getElementById("ipfs")!.innerText = "View contract on IPFS";
  };

  const handleDocusign = () => {
    router.push(`/${lng}/master_recording/docusign_choice`);
    //downloadUnsignedTrue();
  };

  return (
    <div className=" p-4 sm:p-8 flex flex-col justify-between">
      <main className="flex flex-col gap-6 sm:gap-8">
        <div className="w-full sm:w-1/2 py-4 sm:py-10 mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center font-share p-0">
            {t("congratulations-message")}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center font-rubik p-0">
            {t("contract-created-message")}
          </h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleFreeDownload}
              className=" text-white py-2 px-4 rounded  transition-colors font-rubik py-1 button-height"
            >
              {t("download-unsigned-version")}
            </button>
            <button
              onClick={handleDocusign}
              className=" text-white py-2 px-4 rounded  transition-colors font-rubik p-0 button-height"
            >
              {t("send-to-docusign")}
            </button>
            <a id="ipfs" className="text-center" href={cid}></a>
          </div>
        </div>
        <p className="text-base sm:text-lg font-share mx-auto">{t("lawyer-advice")}</p>
      </main>
    </div>
  );
};

export default Success;
