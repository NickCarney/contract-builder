"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
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
  const [masterContributorType, setMasterContributorType] = useState(
    pageData.masterContributorType || ""
  );
  const [split, setSplit] = useState<number>(pageData.split || -1);
  const [splitTotal, setSplitTotal] = useState<number>(
    pageData.splitTotal || 0
  );

  const [aka, setAka] = useState(pageData.aka || "");
  const [ipi, setIpi] = useState(pageData.ipi || "");
  const [id, setId] = useState(pageData.id || "");
  const [producer, setProducer] = useState(pageData.producer || "");
  const [address, setAddress] = useState(pageData.address || "");


  const resetPages = useDynamicPageStore((state) => state.resetPages);
  const { lng, page } = params;
  const { t } = useTranslation(lng, "both/dynamic");

  useEffect(() => {
    
    resetPages(pageNumber); // Reset all stored info
  }, [pageNumber, resetPages]);

  // Update Zustand store only if inputs change
  useEffect(() => {
    const data = {
      legalName,
      email,
      contributorType,
      masterContributorType,
      split,
      splitTotal,
      aka,
      ipi,
      id,
      producer,
      address,
    };
    useDynamicPageStore.setState((state) => ({
      pages: {
        ...state.pages,
        [pageNumber]: { ...state.pages[pageNumber], ...data },
      },
    }));
  }, [
    legalName,
    email,
    contributorType,
    masterContributorType,
    split,
    splitTotal,
    pageNumber,
    aka,
    ipi,
    id,
    producer,
    address,
  ]);

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

  const handleMasterContributorChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setMasterContributorType(event.target.value);
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
      document.getElementById("ownershipPercentage")!.innerHTML = String(value);
      //document.getElementById("productionPercentage")!.innerHTML = String(value);
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
    const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setId(value);
    };
    const handleProducerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setProducer(value);
    };
    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setAddress(value);
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
        `/both/${previousPage}?pageCount=${pageCount}&split=${splitTotal}`
      );
    } else {
      router.push(`/both/question2`);
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
        split <= 100 &&
        masterContributorType != ""
      ) {
        const nextPage = pageNumber + 1;
        router.push(
          pageNumber >= pageCount
            ? `/both/question4?pageCount=${pageCount}`
            : `/both/${nextPage}?pageCount=${pageCount}&split=${splitTotal}`
        );
      }
    }
  };

  return (
    <div className=" p-4 sm:p-8 flex flex-col justify-between">
      <main className="flex flex-col sm:flex-row">
        <div className="sm:w-[50%]">
          <h2 className="text-[1.5rem] sm:text-xl font-share">
            {t("collaborator")} {pageNumber}
          </h2>
          <form className="flex flex-col gap-4">
            <div>
              <label className="text-[.5rem] sm:text-sm block font-share">
                {t("legalNameShort")}
              </label>
              <input
                type="text"
                placeholder={legalName}
                value={legalName}
                onChange={handleNameChange}
                className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full p-2 font-rubik"
                required
              />
            </div>
            
            <div>
              <label className="text-[.5rem] sm:text-sm block font-share">
                {t("emailShort")}
              </label>
              <input
                type="email"
                placeholder={email}
                value={email}
                onChange={handleEmailChange}
                className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full p-2 font-rubik"
                required
              />
            </div>
            <div className="flex sm:flex-row flex-col">
              <div className="sm:w-[90%]">
                <label className="text-[.5rem] sm:text-sm block font-share sm:w-fit">
                  {t("compositionContributionType")}
                </label>
                <select
                  name="type"
                  id="cont"
                  value={contributorType}
                  className="bg-black p-2 size-10 w-full sm:w-[140%] sm:w-full font-rubik"
                  onChange={handleContributorChange}
                  required
                >
                  <option value=""></option>
                  <option value={t("lyrics")}>{t("lyrics")}</option>
                  <option value={t("music")}>{t("music")}</option>
                  <option value={t("musicAndLyrics")}>{t("musicAndLyrics")}</option>
                  <option value={t("publisher")}>{t("publisher")}</option>
                  <option value="Interpreter">Interpreter</option>
                </select>
              </div>
              <div className="sm:w-full sm:pl-8">
                <label className="text-[.5rem] sm:text-sm block font-share">
                  {t("masterContributionType")}
                </label>
                <select
                  name="type"
                  id="cont"
                  value={masterContributorType}
                  className="bg-black size-10 w-full font-rubik"
                  onChange={handleMasterContributorChange}
                  required
                >
                  <option value=""></option>
                  <option value={t("artist")}>{t("artist")}</option>
                  <option value={t("prodRight")}>{t("prodRight")}</option>
                  <option value={t("executiveProducer")}>{t("executiveProducer")}</option>
                  <option value={t("engineer")}>{t("engineer")}</option>
                </select>
                </div>
              </div>
              <div className="flex sm:flex-row flex-col">
              <div className="sm:w-[90%]">
                <label className="text-[.5rem] sm:text-sm block font-share w-fit">
                  {t("splitPercentage")}
                </label>
                <input
                  type="text"
                  max="100"
                  onChange={handleSplitChange}
                  className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full p-2 font-rubik"
                  required
                />
              </div>
              <div className="sm:w-full sm:pl-8">
                <label className="text-[.5rem] sm:text-sm block font-share">
                  {t("producer")}
                </label>
                <input
                  type="text"
                  onChange={handleProducerChange}
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
                className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full p-2 font-rubik"
                required
              />
            </div>
            <div className="flex sm:flex-row flex-col">
              <div className="sm:w-[90%]">
                <label className="text-[.5rem] sm:text-sm block font-share">
                  {t("id")}
                </label>
                <input
                  type="text"
                  onChange={handleIdChange}
                  className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full p-2 font-rubik"
                  required
                />
              </div>
              <div className="sm:w-full sm:pl-8">
                <label className="text-[.5rem] sm:text-sm block font-share">
                  {t("ipi")}
                </label>
                <input
                  type="text"
                  onChange={handleIPIChange}
                  className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full p-2 font-rubik"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[.5rem] sm:text-sm block font-share">
                {t("address")}
              </label>
              <input
                type="text"
                value={address}
                onChange={handleAddressChange}
                className="rounded-lg bg-black border border-white text-white focus:outline-none focus:ring-2 focus:ring-white w-full p-2 font-rubik"
                required
              />
            </div>
          </form>
        </div>
        <div className="w-full sm:w-1/2 pl-4">
          <p className="sm:text-sm text-gray-500 sm:mb-4 font-roboto_thin text-[0px]">
            {t("musicWorkIdentification")}
          </p>
          <h3 className="font-roboto_bold text-[0px] sm:text-base">
            {t("compositionContributionType")}
          </h3>
          <p className=" text-[0px] sm:text-base sm:mb-4 font-roboto_light">
            {t("contributionAcknowledgement")}
          </p>
          <h3 className=" text-[0px] sm:text-base font-roboto_bold">
            {t("collaborator")} {pageNumber}:
          </h3>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("legalNameShort")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium text-[0px] sm:text-base">
              {legalName}
            </span>
          </p>
          
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("emailShort")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium text-[0px] sm:text-base">
              {email}
            </span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("compositionContributionType")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium text-[0px] sm:text-base">
              {contributorType}
            </span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("masterContributionType")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium text-[0px] sm:text-base">
              {" "}
              {masterContributorType}
            </span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("ownershipPercentage")}:
            <span
              className="text-[#AC4444] font-rubik_medium text-[0px] sm:text-base"
              id="ownershipPercentage"
            ></span>
          </p>
          
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("producer")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium" >{producer}</span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            AKA:{" "}
            <span className="text-[#AC4444] font-rubik_medium text-[0px] sm:text-base">
              {aka}
            </span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("idRight")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium text-[0px] sm:text-base">
              {id}
            </span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("ipiRight")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium">{ipi}</span>
          </p>
          <p className=" text-[0px] sm:text-base font-roboto_light">
            {t("addressRight")}:{" "}
            <span className="text-[#AC4444] font-rubik_medium" id="address">{address}</span>
          </p>
        </div>
      </main>
      <footer className="flex flex-col gap-6 row-start-3 pl-4">
        <p
          id="wrongSplits"
          className="text-[#AC4444] text-lg text-sm sm:text-base"
        ></p>
        <div className="inline-flex relative bottom-0 left-0 right-0 justify-between sm:justify-normal sm:gap-20 gap-5">
          <button
            onClick={handleBackPage}
            className="  w-[15%]  bg-[#AC444475] flex-1 sm:flex-none "
          >
            {t("back")}
          </button>
          <button
            onClick={handleNextPage}
            className=" w-[15%] text-white py-2 px-4 relative bg-[#AC444475] flex-1 sm:flex-none"
          >
            {t("next")}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default DynamicPage;
