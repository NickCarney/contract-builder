import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import mesaImage from "./public/images/mesa_logo.png";
import { dir } from "i18next";
import { languages } from "../i18n/settings";
// import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "../i18n";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import Agent from "../components/agent";

import { Providers } from './providers'; 

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata: Metadata = {
  title: "Mesa contract builder",
  description: "create music splits contracts",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}) {
  const { lng } = await params; // eslint-disable-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lng); // eslint-disable-line react-hooks/rules-of-hooks


  return (
    <html lang={lng} dir={dir(lng)}>
      <body>
        <header className="flex items-center justify-between h-20 px-4">
          <div className="flex items-center space-x-2">
            <a href="/" className="focus:outline-none">
              <Image src={mesaImage} width={190} height={60} alt="M"></Image>
            </a>
            <p className="float-left text-[32px]"></p>
          </div>
          <div>{/* <LanguageSwitcher /> */}</div>
          <div className="text-right text-xs w-[17rem]">
            <p className="text-2xl font-black font-rubik text-[16px] sm:text-[24px]">
              MUSIC SPLITS
            </p>
            <div className="font-share sm:text-center">
              {t("contract-builder")}
            </div>
          </div>
        </header>
        <hr className="w-full absolute" /> 
        <Providers>{children}</Providers>
        <SpeedInsights />
        <Analytics />
        <div className="relative">
        <Agent params={{ lng: lng }}/>
        </div>
        <Image
          src={mesaImage}
          width={95}
          height={30}
          alt="M"
          className="relative left-1/2 transform -translate-x-1/2"
        ></Image>
        
      </body>
    </html>
  );
}
