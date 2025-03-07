"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useQuestion4 from "../../store/useQuestion4";
import { useTranslation } from "@/app/i18n/client";

const ContractBuilder4 = ({
  params,
}: {
  params: {
    lng: string;
  };
}) => {
  const { push } = useRouter();
  const [selectedOption, setSelectedOption] = useState("");
  const { lng } = params;
  const { t } = useTranslation(lng, "musical_work/question4");
  const pageCount = useSearchParams().get("pageCount");
  const lastSplit = Number(useSearchParams().get("split"));

  const updateVoteSelection = useQuestion4(
    (state) => state.updateVoteSelection
  );

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const findNextPage = () => {
    updateVoteSelection(selectedOption);
    if (selectedOption == "VOTE") {
      push("/musical_work/question5vote");
    } else if (selectedOption == "ADMIN") {
      push("/musical_work/question5admin");
    } else if (selectedOption == "SKIP") {
      push("/musical_work/success");
    }
  };

  return (
    <div className=" p-4 sm:p-8 flex flex-col justify-between">
      <main className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        <div className="w-full sm:w-1/2 py-4 sm:py-10">
          <h4 className="mb-4 pt-5 font-share text-[1.5rem]">
            {t("businessDecisionQuestion")}
          </h4>
          <form className="flex flex-col gap-2">
            <label className="flex items-center font-rubik">
              <input
                type="radio"
                name="type"
                className="radio mr-2"
                value="VOTE"
                onChange={handleRadioChange}
                required
              />
              <span className="text-sm sm:text-base mt-2">{t("voteOption")}</span>
            </label>
            <label className="flex items-center font-rubik">
              <input
                type="radio"
                name="type"
                className="radio mr-2"
                value="ADMIN"
                onChange={handleRadioChange}
                required
              />
              <span className="text-sm sm:text-base mt-2">{t("adminOption")}</span>
            </label>
            <label className="flex items-center font-rubik">
              <input
                type="radio"
                name="type"
                className="radio mr-2"
                value="SKIP"
                onChange={handleRadioChange}
                required
              />
              <span className="text-sm sm:text-base mt-2">{t("skipOption")}</span>
            </label>
          </form>
        </div>
        <div className="w-full sm:w-1/2 p-4 sm:p-8">
          <p className="text-gray-500 mb-4  font-share">{t("skipDescription")}</p>
        </div>
      </main>
      <footer className="flex flex-col gap-6 row-start-3">
        <div className="inline-flex relative bottom-0 left-0 right-0 justify-between sm:justify-normal sm:gap-20 gap-5">
          <button
            onClick={() =>
              push(
                `/musical_work/${pageCount}?pageCount=${pageCount}&split=${
                  100 - lastSplit
                }`
              )
            }
            className="  w-[15%]  bg-[#AC444475] flex-1 sm:flex-none "
          >
            {t("backButton")}
          </button>
          <button
            onClick={findNextPage}
            className="  w-[15%]  bg-[#AC444475] flex-1 sm:flex-none "
          >
            {t("submitButton")}
          </button>
        </div>
      </footer>
    </div>
  );
};

const WrappedContractBuilder4 = ({
  params,
}: {
  params: {
    lng: string;
  };
}) => {
  const { lng } = params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContractBuilder4 params={{ lng: lng }} />
    </Suspense>
  );
};

export default WrappedContractBuilder4;
