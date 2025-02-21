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
    };
    useDynamicPageStore.setState((state) => ({
      pages: {
        ...state.pages,
        [pageNumber]: { ...state.pages[pageNumber], ...data },
      },
    }));
  }, [legalName, email, contributorType, split, splitTotal, pageNumber]);

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
    const value = Number(event.target.value);
    setSplit(value);
    setSplitTotal(value + lastSplit);
    if (value >= 0) {
      document.getElementById("split")!.innerHTML = String(value);
    }
  };

  const handleNextPage = () => {
    if (pageNumber >= pageCount && splitTotal !== 100) {
      const splitNeeded = (100 - splitTotal + split).toFixed(2);
      document.getElementById("wrongSplits")!.innerHTML =
        t("splitHelp") + ". You need " +
        splitNeeded +
        " instead of " +
        split;
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
    if (previousPage > 0) {
      setSplitTotal(splitTotal - split);
      router.push(
        `/musical_work/${previousPage}?pageCount=${pageCount}&split=${splitTotal}`
      );
    } else {
      router.push(`/musical_work/question3`);
    }
  };

  return (
    <div className="p-4 flex flex-col justify-between">
      <main className="flex flex-col sm:flex-row pt-7">
        <div className="w-full">
          <h2 className="text-[1.5rem] sm:text-xl mb-4 font-share">
            {t("contributorLabel")} {pageNumber}
          </h2>
          <form className="flex flex-col gap-4">
            <div>
              <label className="text-[.5rem] text-sm mb-2 block font-share">
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
              <label className="text-[.5rem] text-sm mb-2 block font-share">
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
            <div className="flex flex-row gap-8">
              <div className="w-full sm:w-[38.5%]">
                <label className="text-[.5rem] text-sm mb-2 block font-share">
                  {t("contributionTypeLabel")}
                </label>
                <select
                  name="type"
                  id="cont"
                  value={contributorType}
                  className="bg-black p-2 size-10 w-fit font-rubik"
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
              <div className="sm:w-[38.5%]">
                <label className="text-[.5rem] text-sm mb-2 block font-share">
                  {t("splitPercentageLabel")}
                </label>
                <input
                  type="number"
                  max="100"
                  onChange={handleSplitChange}
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
          <h3 className="text-base mb-2 font-roboto_bold">{t("musicWorkIdentification")}</h3>
          <p className="text-sm sm:text-base mb-4 font-roboto_light">
            {t("acknowledgementMessage")}
            <span className="text-[#AC4444] font-rubik"> {song}</span>
          </p>
          <h3 className="text-base mb-2 font-roboto_bold">
            {t("contributorLabel")} {pageNumber}:
          </h3>
          <p className="text-sm sm:text-base font-roboto_light">
            {t("legalNameSummary")}:{" "}
            <span className="text-[#AC4444] font-rubik">{legalName}</span>
          </p>
          <p className="text-sm sm:text-base font-roboto_light">
            {t("emailSummary")}:{" "}
            <span className="text-[#AC4444] font-rubik">{email}</span>
          </p>
          <p className="text-sm sm:text-base font-roboto_light">
            {t("contributionSummary")}:{" "}
            <span className="text-[#AC4444] font-rubik ">
              {contributorType}
            </span>
          </p>
          <p className="text-sm sm:text-base font-roboto_light">
            {t("ownershipPercentageSummary")}:{" "}
            <span className="text-[#AC4444] font-rubik" id="split"></span>
          </p>
        </div>
      </main>
      <footer className="flex flex-col gap-6 row-start-3">
        <p
          id="wrongSplits"
          className="text-red-500 text-lg text-sm sm:text-base"
        ></p>
        <div className="inline-flex relative bottom-0 left-0 right-0 justify-between sm:justify-normal sm:gap-20 gap-5 sm:pt-[15%]">
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
