"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useJurisdiction from "./store/useJurisdiction";
import { useTranslation } from "../i18n/client";
import Popup from "reactjs-popup";

export default function Home({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  let { lng } = params;
  //if (languages.indexOf(lng) < 0) lng = fallbackLng;
  const { push } = useRouter();
  let { t } = useTranslation(lng);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [lang, setLang] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');

  const updateLanguage = useJurisdiction((state) => state.updateLanguage);
  const updateJurisdiction = useJurisdiction((state) => state.updateJurisdiction);

  const handleJurisdictionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJurisdiction(event.target.value);
  };

  const changePopup = () =>{
    setIsOpen2(true);
    setTimeout(() => {
      setIsOpen2(false);    
    }, 200);
    document.getElementById('popup3')?.click()
  }

  const handleLangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    lng = event.target.value;
    setLang(lng);
  };
  
  ({t} = useTranslation(lang))

  const handleSubmit = () =>{
    updateLanguage(lang);
    updateJurisdiction(jurisdiction);
    push(`/${lang}/question1`)
  }
  return (
    <div className="flex flex-col items-center md:items-start pt-20  p-2 w-full sm:w-3/5 sm:mx-auto">
      <section className="w-full flex flex-col gap-5">
        <p className="md:text-[32px] text-[20px] font-share tracking-[-0.05rem] text-start">
          {t("welcome-message-part1")}
          <span className="font-rubik">{t("mesa")}</span>
          {t("welcome-message-part2")}
        </p>
        <p className="md:text-[24px] text-[16px] text-2xl font-share tracking-[-0.05rem] text-start">
          {t("intro")}
          <br />
          {t("contract-eligibility-title")}
        </p>
        <ol className="list-disc pl-6 text-sm sm:text-base text-start md:text-[24px] text-[16px] font-share tracking-[-0.05rem] pt-4">
          <li className="pb-2">{t("eligibility-condition1")}</li>
          <li className="pb-2"> {t("eligibility-condition2")}</li>
          <li className="pb-2">{t("eligibility-condition3")}</li>
        </ol>
      </section>
      <footer className="mt-8 flex flex-col text-start pt-4">
        <p className="font-rubik text-black text-outline-red text-center text-[35px] sm:text-[0px] px-0">
          {t("control-your")}
        </p>
        <span className="text-white font-rubik text-center text-[35px] sm:text-[0px]">
          {t("music")}
        </span>
        {!isOpen2 && (
          <Popup
            trigger={<button>{t("get-started-button")}</button>}
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
                  <p className="text-sm sm:text-base space-y-4 font-roboto">
                    {t("disclaimer1")}
                    <br />
                    {t("disclaimer2")}
                    <br />
                    {t("disclaimer3")}
                    <br />
                    <div className="flex justify-end">
                      <button
                        onClick={changePopup}
                        className="border-none bg-[#82828270]"
                      >
                        {t("proceed-button")}&rarr;
                      </button>
                    </div>
                  </p>
                </main>
              </div>
            </div>
          </Popup>
        )}


        {!isOpen3&& (
          <Popup
            trigger={<button id="popup3" className="invisible"></button>}
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
                <main className="flex flex-col gap-3 sm:gap-5 text-center">
                  <button
                    onClick={() => {
                      setIsOpen3(true);
                      setTimeout(() => {
                        setIsOpen3(false);
                      }, 200);
                    }}
                    className="popup_button text-white hover:text-gray-300"
                  >
                    &times;
                  </button>
                  <p className="text-sm sm:text-base space-y-4 font-roboto text-xl">
                    {t("language-question")}
                  </p>
                  <select
                  name="type"
                  id="cont"
                  value={lang}
                  className="bg-black p-2 size-10 w-full font-rubik"
                  onChange={handleLangChange}
                  required
                >
                  <option value="">{t('choose-language')}</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>

                <p className="font-roboto text-[1rem] w-full pt-4 my-0">{t("jurisdiction")}</p>
                <label className="py-0 text-[.6rem] text-gray-500 my-0" id="if-usa">{t('if-usa')}
                    <input
                      type="text"
                      name="type"
                      onChange={handleJurisdictionChange}
                      className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full p-2 font-rubik"
                      required
                    />
                    </label>
                    <h1 className="p-0">
                      {t("dispute")}
                    </h1>
                    <p className="font-roboto_thin p-0">
                      {t("jurisdiction-statement")}{" "}
                      <span className="text-[#AC4444] text-lg font-rubik">
                        {jurisdiction}
                      </span>
                      .
                    </p>


                  <div className="flex justify-end">
                    {!isOpen4 && (
                              <Popup
                                trigger={
                                  <a className="mx-auto underline underline-offset-4 pb-5 ">
                                    {t("read-here")}
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
                                  <p className="pt-20">{t("more-info")}</p>
                                  <button
                                    onClick={() => {
                                      setIsOpen4(true);
                                      setTimeout(() => {
                                        setIsOpen4(false);
                                      }, 200);
                                    }}
                                    className="popup_button text-white hover:text-gray-300"
                                  >
                                    &times;
                                  </button>
                                </div>
                              </Popup>
                            )}

                      <button
                        onClick={handleSubmit}
                        className="border-none bg-[#82828270] absolute right-7 bottom-7"
                      >
                        {t("proceed-button")}&rarr;
                      </button>
                    </div>
                </main>
              </div>
            </div>
          </Popup>
        )}



        {!isOpen && (
          <Popup
            trigger={
              <a className="font-share text-2xl text-link underline text-center text-[18px] pt-2">
                {t("confused-link")}
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
              <p>{t("popups.self-publishing-distribution-info")}</p>
              <ul>
                <li>
                  {t("popups.self-publishing-title")}
                  <br />
                  {t("popups.what-is-publishing")}
                  <br />
                  {t("popups.publishing-info")}
                </li>
                <br />
                <li>
                  {t("popups.self-distribution-title")}
                  <br />
                  {t("popups.what-is-distribution")}
                  <br />
                  {t("popups.distribution-info")}
                </li>
                <br />
                <li>
                  {t("popups.legal-responsibilities-title")}
                  <br />
                  <ol className="list-disc pl-5">
                    <li>{t("popups.contracts-licensing-info")}</li>
                    <br />
                    <li>{t("popups.copyright-registration-info")}</li>
                  </ol>
                  <br />
                </li>
              </ul>
              {t("popups.summary-title")}
              <br />
              <p>{t("popups.self-publishing-distribution-summary")}</p>
              <button
                onClick={() => {
                  setIsOpen(true);
                  setTimeout(() => {
                    setIsOpen(false);
                  }, 200);
                }}
                className="popup_button text-white hover:text-gray-300"
              >
                &times;
              </button>
            </div>
          </Popup>
        )}
      </footer>
    </div>
  );
}
