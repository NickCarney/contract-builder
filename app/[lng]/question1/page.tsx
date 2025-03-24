"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useQuestion1 from "../store/useQuestion1";
import { useTranslation } from "@/app/i18n/client";

function ContractBuilder1({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  const { lng } = params;
  const { t } = useTranslation(lng, "question1");
  const { push } = useRouter();
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedDate, setSelectedDate] = useState("");

  const updateSplit = useQuestion1((state) => state.updateSplit);
  const updateDate = useQuestion1((state) => state.updateDate);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.id);
    setSelectedDate(date);
    const value = event.target.id;
    console.log(value);
    console.log(selectedDate);
  };

  const handleSubmit = () => {
    updateSplit(selectedOption);
    updateDate(selectedDate);
    if (selectedOption == t("option_songwriting")) {
      push("/musical_work/question2");
    } else if (selectedOption == t("option_master_recording")) {
      push("master_recording/question2");
    } else if (selectedOption == t("option_both")) {
      push("both/question2");
    }
  };

  const date = new Date().toLocaleDateString();

  return (
    <div className="p-4 sm:p-8 flex flex-col justify-between max-h-screen">
      <main className="flex flex-col sm:flex-row sm:gap-8 pt-10">
        <div className="sm:w-1/2 py-4 sm:py-10">
          <p className=" mb-4 font-share text-[1.5rem] w-full">{t("question_prompt")}</p>
          <form className="flex flex-col font-rubik items-start">
            <label className="p-2">
              <input
                type="radio"
                name="type"
                onChange={handleRadioChange}
                className="radio"
                id={t("option_songwriting")}
                required
                //defaultChecked
              />
              {t("option_songwriting")}
            </label>
            <label className="p-2">
              <input
                type="radio"
                name="type"
                onChange={handleRadioChange}
                className="radio"
                id={t("option_master_recording")}
              />
              {t("option_master_recording")}
            </label>
            <label className="p-2">
              <input
                type="radio"
                name="type"
                onChange={handleRadioChange}
                className="radio"
                id={t("option_both")}
              />
              {t("option_both")}

            </label>
          </form>
        </div>
        <div className="font-roboto_bold">
          <p className="text-[0px] sm:text-[16px] pb-5 text-gray-500 font-roboto_light pt-0">
            {t("incomplete_contract_notice")}
          </p>
          <p className="p-5 pl-0">
            {t("copyright_agreement", { selectedOption: selectedOption })}
          </p>
          <p className="font-roboto_thin">
            {t("agreement_date")}{" "}
            <span className="text-[#AC4444] text-lg font-rubik">
              {selectedDate ? selectedDate : " "}
            </span>
          </p>
        </div>
      </main>
      <footer className="flex flex-col gap-6 row-start-3 sm:pt-[10%]">
        
        <div className="inline-flex relative bottom-0 left-0 right-0 justify-between sm:justify-normal sm:gap-20 gap-5">
          <button
            onClick={() => push("/")}
            className=" w-[15%]  bg-[#AC444475] flex-1 sm:flex-none"
          >
            {t("back_button")}
          </button>
          <button
            onClick={handleSubmit}
            className=" w-[15%]  bg-[#AC444475] flex-1 sm:flex-none"
          >
            {t("submit_button")}
          </button>
        </div>
      </footer>
      
    </div>
  );
}

export default ContractBuilder1;
