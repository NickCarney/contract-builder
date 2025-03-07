"use client";

import React from "react";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import useQuestion5Vote from "../../store/useQuestion5Vote";
import { useTranslation } from "@/app/i18n/client";

const ContractBuilder5Vote = ({
  params,
}: {
  params: {
    lng: string;
  };
}) => {
  const { push } = useRouter();
  const [percent, setPercent] = useState("");
  const updatePercent = useQuestion5Vote((state) => state.updatePercent);
  const { lng } = params;
  const { t } = useTranslation(lng, "both/question5vote");

  const handlePercentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPercent(event.target.value);
  };

  const handleSubmit = () => {
    updatePercent(percent);
    if (percent != "") {
      push("/both/success");
    }
  };

  return (
    <div className=" p-4 sm:p-8 flex flex-col justify-between">
      <main className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        <div className="w-full sm:w-1/2 sm:py-10">
          <h1 className="text-lg sm:text-xl mb-4 font-share w-full">
            {t("ownershipPercentageQuestion")}
          </h1>
          <form className="flex flex-col">
            <label className="text-xs sm:text-sm mb-2">(%)</label>
            <input
              type="text"
              className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white  w-1/5 p-2 font-rubik"
              onChange={handlePercentChange}
            />
          </form>
        </div>
        <div className="w-full sm:w-1/2 sm:p-8">
          <p className="text-gray-500 mb-4 font-roboto_light text-[0px] sm:text-[16px]">
            {t("incompleteContractMessage")}
          </p>
          <h4 className="text-base sm:text-lg font-bold mb-2 font-roboto_bold">
            {t("rightsAndDutiesTitle")}
          </h4>
          <p className="text-xs sm:text-sm mb-4 font-roboto_thin">
            {t("legalActionsRestriction")}{" "}
            <span className="text-[#AC4444] font-rubik">
              {percent ? percent : " "}%
            </span>
            {t("ownershipDetails")}
          </p>
          <ol className="list-decimal pl-5 text-xs sm:text-sm">
            <li>{t("licenseAuthorization")}</li>
            <li>{t("editPermission")}</li>
            <li>{t("nameExploitationRestriction")}</li>
            <li>{t("grantLicenses")}</li>
          </ol>
        </div>
      </main>
      <footer className="flex flex-col gap-6 row-start-3">
        <div className="inline-flex relative bottom-0 left-0 right-0 justify-between sm:justify-normal sm:gap-20 gap-5">
          <button
            onClick={() => push("/both/question4")}
            className="  w-[15%]  bg-[#AC444475] flex-1 sm:flex-none "
          >
            {t("backButton")}
          </button>
          <button
            onClick={handleSubmit}
            className="  w-[15%]  bg-[#AC444475] flex-1 sm:flex-none "
          >
            {t("submitButton")}
          </button>
        </div>
      </footer>
    </div>
  );
};

const WrappedContractBuilder5Vote = ({
  params,
}: {
  params: {
    lng: string;
  };
}) => {
  const { lng } = params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContractBuilder5Vote params={{ lng: lng }} />
    </Suspense>
  );
};

export default WrappedContractBuilder5Vote;
