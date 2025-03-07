"use client"

import { useState } from "react";
import { useTranslation } from "../i18n/client";
import Popup from "reactjs-popup";

export default function Agent({
    params,
  }: {
    params: {
      lng: string;
    };
  }){
    const { lng } = params;
    const { t } = useTranslation(lng);
    const [isOpen, setIsOpen] = useState(false);


    return (
        <div>
            {!isOpen && (
                <Popup
                trigger={
                    <a className="font-share underline relative content-center sm:absolute left-[5%] sm:left-[60%] bottom-0">
                    {t("agent")}
                    </a>
                }
                position="top right"
                nested
                className="relative"
                closeOnDocumentClick
                >
                    <div
                        className="modal border-2 border-white"
                        style={{
                        height: "70vh",
                        maxHeight: "800px",
                        width: "90vw",
                        maxWidth: "400px",
                        overflowY: "scroll",
                        }}
                    >
                <iframe
                    src="https://www.chatbase.co/chatbot-iframe/3pO14yLU-QxsoZ9ZTRXmW"
                    width="95%"
                    height="100%"
                ></iframe>
                <button
                    onClick={() => {
                    setIsOpen(true);
                    setTimeout(() => {
                        setIsOpen(false);
                    }, 200);
                    }}
                    className="popup_button text-white hover:text-gray-300 absolute top-0 right-0"
                >
                    &times;
                 </button>
                </div>

                </Popup>
            )}
        </div>
    );

}