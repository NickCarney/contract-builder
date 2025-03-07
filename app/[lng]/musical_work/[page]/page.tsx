"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import useQuestion2 from "../../store/useQuestion2";
import useDynamicPageStore from "../../store/use[page]";
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
  const song = useQuestion2((state) => state.song);

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
  const [ipi, setIpi] = useState(pageData.ipi || "");
  const [address, setAddress] = useState(pageData.address || "");
  const [id, setId] = useState(pageData.id || "");
  const [producer, setProducer] = useState(pageData.producer || "");

  const resetPages = useDynamicPageStore((state) => state.resetPages);
  const { lng, page } = params;
  const { t } = useTranslation(lng, "musical_work/dynamic");

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
      ipi,
      address,
      id,
      producer,
    };
    useDynamicPageStore.setState((state) => ({
      pages: {
        ...state.pages,
        [pageNumber]: { ...state.pages[pageNumber], ...data },
      },
    }));
  }, [legalName, email, contributorType, split, splitTotal, pageNumber, aka, ipi, address, id, producer,]);

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
  const handleIPIChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setIpi(value);
  };
  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAddress(value);
  };
  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setId(value);
  };
  const handleProducerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setProducer(value);
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
            ? `/musical_work/question4?pageCount=${pageCount}&split=${lastSplit}`
            : `/musical_work/${nextPage}?pageCount=${pageCount}&split=${splitTotal}`
        );
      }
    }
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
      setSplitTotal(splitTotal - Math.abs(split));
      router.push(
        `/musical_work/${previousPage}?pageCount=${pageCount}&split=${splitTotal}`
      );
    } else {
      router.push(`/musical_work/question2`);
    }
  };

  return (
    <div className="sm:p-4 justify-between">
      <main className="flex flex-col sm:flex-row">
        <div className="sm:w-[120%]">
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
            <div className="flex flex-col sm:flex-row gap-8 sm:w-[87%]">
              <div className="flex-1">
                <label className="text-[.4rem] sm:text-sm block font-share w-fit">
                  {t("contributionTypeLabel")}
                </label>
                <select
                  name="type"
                  id="cont"
                  value={contributorType}
                  className="bg-black p-2 size-10 size-10 sm:w-fit w-full font-rubik"
                  onChange={handleContributorChange}
                  required
                >
                  <option value=""></option>
                  <option value={t("lyricsOption")}>{t("lyricsOption")}</option>
                  <option value={t("musicOption")}>{t("musicOption")}</option>
                  <option value={t("bothMusicAndLyricsOption")}>{t("bothMusicAndLyricsOption")}</option>
                  <option value={t("publisher")}>{t("publisher")}</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[.4rem] sm:text-sm block font-share">
                  {t("ipi")}{t('optional')}
                </label>
                <input
                  type="text"
                  onChange={handleIPIChange}
                  className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white p-2 font-rubik w-full"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="text-[.4rem] sm:text-sm block font-share">
                  {t("splitPercentageLabel")}
                </label>
                <input
                  type="text"
                  max="100"
                  onChange={handleSplitChange}
                  className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white p-2 font-rubik sm:w-[49%] w-full"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[.5rem] sm:text-sm block font-share">
                {t("aka")}{t('optional')}
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
                {t("address")}{t('optional')}
              </label>
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full max-w-xl p-2 font-rubik"
                required
              />
            </div>
            <div className="flex flex-row gap-8 sm:w-[75%]">
              <div className="">
                <label className="text-[.5rem] sm:text-sm block font-share">
                  {t("id")}{t('optional')}
                </label>
                <input
                  type="text"
                  onChange={handleIdChange}
                  className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full p-2 font-rubik"
                  required
                />
              </div>
              <div className="">
                <label className="text-[.5rem] sm:text-sm block font-share">
                  {t("producer")}{t('optional')}
                </label>
                <input
                  type="text"
                  onChange={handleProducerChange}
                  className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full p-2 font-rubik"
                  required
                />
              </div>
              </div>
          </form>
        </div>
        <div className="w-full sm:pt-7">
          <p className="text-gray-500 mb-4 font-roboto_thin text-[0px] sm:text-[16px]">
            {t("incompleteContractMessage")}
          </p>
          <h3 className=" mb-2 font-roboto_bold text-[0px] sm:text-base">{t("musicWorkIdentification")}</h3>
          <p className="mb-4 font-roboto_light text-[0px] sm:text-base">
            {t("acknowledgementMessage")}
            <span className="text-[#AC4444] font-rubik_medium"> {song}</span>
          </p>
          <h3 className=" text-[0px] sm:text-base mb-2 font-roboto_bold">
            {t("contributorLabel")} {pageNumber}:
          </h3>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("legalNameSummary")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium">{legalName}</span>
          </p>
          
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("emailSummary")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium">{email}</span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("contributionSummary")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium ">
              {contributorType}
            </span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("ownershipPercentageSummary")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium" id="split"></span>
          </p>
          
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("ipi")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium" id="ipi">{ipi}</span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("aka")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium">{aka}</span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("id")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium" id="id">{id}</span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("publisher")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium" id="producer">{producer}</span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("address")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium" id="address">{address}</span>
          </p>
        </div>
      </main>
      <footer className="flex flex-col gap-6 row-start-3 ml-4">
        <p
          id="wrongSplits"
          className="text-red-500 text-lg text-sm sm:text-base"
        ></p>
        <div className="inline-flex relative bottom-0 left-0 right-0 justify-between sm:justify-normal sm:gap-20 gap-5">
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
            {t("submitButton")}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default DynamicPage;
