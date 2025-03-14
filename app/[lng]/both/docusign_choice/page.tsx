"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import docusignImage from "../../public/images/docusign.png";
import useQuestion1 from "../../store/useQuestion1";
import PDF from "../../master_recording/success/pdf";
import { loadStripe } from "@stripe/stripe-js";
import Popup from "reactjs-popup";
import { useState } from "react";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const DocusignChoice = ({
  params,
}: {
  params: {
    lng: string;
  };
}) => {
  const { push } = useRouter();

  const { lng } = params;
  const { t } = useTranslation(lng, "musical_work/docusign_choice");

  const downloadUnsignedTrue = PDF(false);
  let cid = useQuestion1((state) => state.cid);
  const [isOpen2, setIsOpen2] = useState(false);

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

  const handleCheckout = async () => {
    cid = "https://mesa.mypinata.cloud/ipfs/" + cid;
    const response = await fetch(`../api/checkout_sessions`, {
      method: "POST",
    });
    const data = await response.json();
    downloadUnsignedTrue();
    if (data.url) {
      push(data.url);
    }
    //sendEmail(songName);
    
  };

  return (
    <div className="flex flex-col">
      <main className="flex flex-col">
        <div>
          <p className="text-center font-share text-xs pt-10 pb-0">
            {t("3")}
            <br />
          </p>
          <Image
            src={docusignImage}
            width={190}
            height={60}
            alt="DocuSign"
            className="relative mx-auto pt-0"
          ></Image>
          <p className="font-share w-[90%] sm:w-2/5 mx-auto">{t("1")}</p>
        </div>
        <div className="flex flex-row pt-10 justify-center gap-5">
          <div className="">
            <p className="font-rubik">{t("2")}</p>
            <hr className="w-full" />
            <p className="font-share">1x {t("4")}</p>
          </div>
          <div className="">
            <p className="font-rubik">Summary</p>
            <hr className="w-full" />
            <p className="font-share">
              Subtotal $<span className="font-rubik">2.00</span>
            </p>
            <p className="font-share text-right">
              Tax $<span className="font-rubik">0.14</span>
            </p>
            <hr className="w-full" />
            <p className="font-share text-right">
              $<span className="font-rubik text-right">2.14</span>
            </p>
          </div>
        </div>
      </main>
      <footer className="flex flex-col pt-10">
        <div className="relative bottom-0 mx-auto text-center justify-center">
          <button onClick={handleCheckout} className=" w-fit">
            {t("5")}
          </button>
          <br />
          {/* <Checkout productId='bc349f65-4114-43a3-8950-1b1acfd99c43' > 
            <CheckoutButton text="Pay with crypto" className="size-[5%] w-fit mx-auto"/>
            <CheckoutStatus />
          </Checkout>
          <br/> */}

          {!isOpen2 && (
            <Popup
              trigger={
                <a onClick={handleCheckout} className="underline mx-auto">
                  {t("6")}
                </a>
              }
              position="center center"
              modal
              nested
              className="popup"
              closeOnDocumentClick
            >
              <div
                className="modal border-2 border-white"
                style={{
                  height: "80vh",
                  width: "90vw",
                  maxWidth: "600px",
                  overflowY: "scroll",
                }}
              >
                <div className=" p-4 sm:p-8 flex flex-col justify-between">
                  <main className="flex flex-col gap-6 sm:gap-8">
                    <p className="font-share text-center">{t("8")}</p>
                    <button
                      onClick={() => {
                        setIsOpen2(true);
                        setTimeout(() => {
                          setIsOpen2(false);
                        }, 200);
                      }}
                      className="popup_button text-white hover:text-gray-300"
                    >
                      &times;
                    </button>
                  </main>
                </div>
              </div>
            </Popup>
          )}

          <br />
          <a
            onClick={() => push("/both/success")}
            className="underline mx-auto text-grey-500"
          >
            {t("7")}
          </a>
        </div>
      </footer>
    </div>
  );
};

export default DocusignChoice;
