"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import useDynamicPageStore from "../../store/use[page]";
import useQuestion2 from "../../store/useQuestion2";
import { useTranslation } from "@/app/i18n/client";

const DynamicPage = ({
  params,
}: {
  params: {
    lng: string;
    page: string;
  };
}) => {
  const router = useRouter();
  const useParams1 = useParams();
  const searchParams = useSearchParams();
  const pageNumber = Number(useParams1.page);
  const pageCount = Number(searchParams.get("pageCount"));
  const lastSplit = Number(searchParams.get("split"));
  const recording = useQuestion2((state) => state.recording);

  // Get page data from the Zustand store
  const pageData = useDynamicPageStore(
    (state) => state.pages[pageNumber] || {}
  );

  // Local state for input fields
  const [legalName, setLegalName] = useState(pageData.legalName || "");
  const [email, setEmail] = useState(pageData.email || "");
  const [contributorType, setContributorType] = useState(
    pageData.contributorType || ""
  );
  const [split, setSplit] = useState<number>(pageData.split || -1);
  const [splitTotal, setSplitTotal] = useState<number>(
    pageData.splitTotal || 0
  );

  const [aka, setAka] = useState(pageData.aka || "");
  const [address, setAddress] = useState(pageData.address || "");
  const [id, setId] = useState(pageData.id || "");

  const resetPages = useDynamicPageStore((state) => state.resetPages);
  const { lng, page } = params;
  const { t } = useTranslation(lng, "master_recording/dynamic");

  useEffect(() => {
    
    resetPages(pageNumber); // Reset all stored info
  }, [pageNumber, resetPages]);

  // Update Zustand store only if inputs change
  useEffect(() => {
    const data = {
      legalName,
      email,
      contributorType,
      split,
      splitTotal,
      aka,
      address,
      id,
    };
    useDynamicPageStore.setState((state) => ({
      pages: {
        ...state.pages,
        [pageNumber]: { ...state.pages[pageNumber], ...data },
      },
    }));
  }, [legalName, email, contributorType, split, splitTotal, pageNumber, aka, address, id, ]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLegalName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleContributorChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setContributorType(event.target.value);
  };

  const handleSplitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value;
    if(event.target.value.includes('%')){
      value = Number(event.target.value.slice(0,-1));
    }
    else{
      value = Number(event.target.value);
    }
    setSplit(value);
    setSplitTotal(value + lastSplit);
    if (value >= 0) {
      document.getElementById("split")!.innerHTML = String(value);
    }
  };

  const handleAkaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setAka(value);
    };
    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setAddress(value);
    };
    const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setId(value);
    };

  const handleBackPage = () => {
    const previousPage = parseInt(page) - 1;
    if(previousPage == 1){
      setSplitTotal(0);
      router.push(
        `/musical_work/1?pageCount=${pageCount}&split=${0}`
      );
    }
    else if (previousPage > 0) {
      setSplitTotal(splitTotal - split);
      router.push(
        `/master_recording/${previousPage}?pageCount=${pageCount}&split=${splitTotal}`
      );
    } else {
      router.push(`/master_recording/question2`);
    }
  };

  const handleNextPage = () => {
    if(split.toString().includes('%')){
      document.getElementById("wrongSplits")!.innerHTML = t("splitHelp%");
    }
    else if (pageNumber >= pageCount && splitTotal != 100) {
      const splitNeeded = (100 - splitTotal + split).toFixed(2);
      document.getElementById("wrongSplits")!.innerHTML =
        t("splitHelp") + ": " +
        splitTotal +
        "/100" 
        console.log(splitNeeded);
    } else {
      if (
        legalName != "" &&
        email != "" &&
        contributorType != "" &&
        split >= 0 &&
        split <= 100
      ) {
        const nextPage = pageNumber + 1;
        router.push(
          pageNumber >= pageCount
            ? `/master_recording/question4?pageCount=${pageCount}&split=${lastSplit}`
            : `/master_recording/${nextPage}?pageCount=${pageCount}&split=${splitTotal}`
        );
      }
    }
  };

  return (
    <div className="p-4 flex flex-col justify-between">
      <main className="flex flex-col sm:flex-row">
        <div className="w-full">
          <h2 className="text-[1.5rem] sm:text-xl mb-4 font-share">
            {t("contributorLabel")} {pageNumber}
          </h2>
          <form className="flex flex-col gap-4">
            <div>
              <label className="text-[.5rem] sm:text-sm block font-share">
                {t("legalNameLabel")}
              </label>
              <input
                type="text"
                value={legalName}
                onChange={handleNameChange}
                className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full max-w-xl p-2 font-rubik"
                required
              />
            </div>
            
            <div>
              <label className="text-[.5rem] sm:text-sm block font-share">
                {t("emailLabel")}
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full max-w-xl p-2 font-rubik"
                required
              />
            </div>
            <div className="flex flex-row gap-8 w-full">
              <div className="w-full sm:w-fit">
                <label className="text-[.5rem] sm:text-sm block font-share">
                  {t("contributionTypeLabel")}
                </label>
                <select
                  name="type"
                  id="cont"
                  value={contributorType}
                  className="bg-black p-2 size-10 w-full font-rubik"
                  onChange={handleContributorChange}
                  required
                >
                  <option value=""></option>
                  <option value={t("artistOption")}>{t("artistOption")}</option>
                  <option value={t("producerOption")}>{t("producerOption")}</option>
                  <option value={t("execProducerOption")}>{t("execProducerOption")}</option>
                  <option value={t("engineerOption")}>{t("engineerOption")}</option>
                  <option value="Interpreter">Interpreter</option>
                </select>
              </div>
              <div className="sm:w-[37%]">
                <label className="text-[.5rem] sm:text-sm block font-share">
                  {t("splitPercentageLabel")}
                </label>
                <input
                  type="text"
                  max="100"
                  onChange={handleSplitChange}
                  className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full p-2 font-rubik"
                  required
                />
              </div>
            </div>
            <div>
            <label className="text-[.5rem] sm:text-sm block font-share">
                {t("aka")}
              </label>
              <input
                type="text"
                value={aka}
                onChange={handleAkaChange}
                className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full max-w-xl p-2 font-rubik"
                required
              />
              </div>
              <div>
                <label className="text-[.5rem] sm:text-sm block font-share">
                  {t("id")}
                </label>
                <input
                  type="text"
                  onChange={handleIdChange}
                  className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full max-w-xl p-2 font-rubik"
                  required
                />
              </div>
            <div>
              <label className="text-[.5rem] sm:text-sm block font-share">
                {t("address")}
              </label>
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full max-w-xl p-2 font-rubik"
                required
              />
            </div>
          </form>
        </div>
        <div className="w-full sm:pt-7">
          <p className="text-gray-500 mb-4 font-roboto_thin text-[0px] sm:text-[16px]">
            {t("incompleteContractMessage")}
          </p>
          <h3 className=" font-roboto_bold pt-5 text-[0px] sm:text-base">{t("masterRecordingIdentification")}</h3>
          <div className="w-[90%]">
          <p className=" font-roboto_light text-[0px] sm:text-base">
            {t("contractPartiesAcknowledgement", {recording})}
            <span className="text-[#AC4444] font-rubik_medium text-[0px] sm:text-base"> {recording}</span>
            {t("contractPartiesAcknowledgementSuffix")}
          </p>
          <p className="font-roboto_light pt-1 text-[0px] sm:text-base">{t('adk2')}</p>
          </div>
          <h3 className=" font-roboto_bold pt-5 text-[0px] sm:text-base">
            {t("contributorLabel")} {pageNumber}:
          </h3>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("legalNameShortLabel")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium text-[0px] sm:text-base">{legalName}</span>
          </p>
          
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("emailShortLabel")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium text-[0px] sm:text-base">{email}</span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("contributionShortLabel")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium  text-[0px] sm:text-base">
              {contributorType}
            </span>
          </p>
          <p className=" font-roboto_light text-[0px] sm:text-base">
            {t("ownershipPercentageLabel")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium text-[0px] sm:text-base" id="split"></span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("aka2")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium text-[0px] sm:text-base">{aka}</span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("id2")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium text-[0px] sm:text-base">{id}</span>
          </p>
          <p className=" font-roboto_light text-[0px] sm:text-base">
            {t("address2")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium text-[0px] sm:text-base">{address}</span>
          </p>
        </div>
      </main>
      <footer className="flex flex-col gap-6 row-start-3">
        <p
          id="wrongSplits"
          className="text-red-500 text-lg text-sm sm:text-base"
        ></p>
        <div className="inline-flex relative bottom-0 left-0 right-0 justify-between sm:justify-normal sm:gap-20 gap-5 ml-4">
          <button
            onClick={handleBackPage}
            className="  w-[15%]  bg-[#AC444475] flex-1 sm:flex-none "
          >
            {t("backButton")}
          </button>
          <button
            onClick={handleNextPage}
            className=" w-[15%] text-white py-2 px-4 relative bg-[#AC444475] flex-1 sm:flex-none"
          >
            {t("submitButtonLabel")}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default DynamicPage;
