"use client";

import React, { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import useQuestion5Admin from "../../store/useQuestion5Admin";
import { useTranslation } from "@/app/i18n/client";

const ContractBuilder5Admin = ({
  params,
}: {
  params: {
    lng: string;
  };
}) => {
  const { push } = useRouter();
  const [name, setSelectedOptionName] = useState("");
  const updateAdminName = useQuestion5Admin((state) => state.updateAdminName);
  const { lng } = params;
  const { t } = useTranslation(lng, "master_recording/question5admin");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOptionName(event.target.value);
  };

  const handleSubmit = () => {
    updateAdminName(name);
    if (name != "") {
      push("/master_recording/success");
    }
  };

  return (
    <div className=" p-4 sm:p-8 flex flex-col justify-between">
      <main className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        <div className="w-full sm:w-1/2 sm:py-10">
          <h1 className="text-lg sm:text-xl font-share">{t("questionAdminName")}</h1>
          <form className="flex flex-col">
            <label className="text-xs font-share py-2">{t("adminNameList")}</label>
            <input
              type="text"
              onChange={handleNameChange}
              className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full sm:w-4/5 p-2 font-rubik"
            />
          </form>
          <div className=" w-4/5 sm:mt-[20%]">
          </div>
        </div>
        <div className="w-full sm:w-1/2 sm:p-8">
          <p className="sm:text-sm text-gray-500 font-roboto_light text-[0px]">
            {t("incompleteContractMessage")}
          </p>
          <h4 className="text-base sm:text-lg font-roboto_bold">{t("adminDesignationTitle")}</h4>
          <p className="font-roboto_thin">
            {t("adminDesignationIntro")} <span className="text-[#AC4444] font-rubik">{name}</span>
            {t("adminDesignationDetails")}
          </p>
        </div>
      </main>
      <footer className="flex flex-col gap-6 row-start-3">
        <div className="inline-flex relative bottom-0 left-0 right-0 justify-between sm:justify-normal sm:gap-20 gap-5 sm:pl-4">
          <button
            onClick={() => push("/master_recording/question4")}
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

const WrappedContractBuilder5Admin = ({
  params,
}: {
  params: {
    lng: string;
  };
}) => {
  const { lng } = params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContractBuilder5Admin params={{ lng: lng }} />
    </Suspense>
  );
};

export default WrappedContractBuilder5Admin;
