import { jsPDF } from "jspdf";

import useQuestion1 from "../../store/useQuestion1";
import useQuestion2 from "../../store/useQuestion2";
//import useQuestion3 from '../../store/useQuestion3'; //NOT USED
import useQuestion4 from "../../store/useQuestion4";
import useDynamicPageStore from "../../store/use[page]";
import useQuestion5Admin from "../../store/useQuestion5Admin";
import useQuestion5Vote from "../../store/useQuestion5Vote";
import useJurisdiction from "../../store/useJurisdiction";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

const getX = (text: string) => {
  let x = 0;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const width = doc.getTextWidth(text);
  x = (pageWidth - width) / 2;
  return Math.abs(x);
};

const PDF = (isClicked: boolean) => {
  const date = useQuestion1((state) => state.date);
  const song = useQuestion2((state) => state.song);
  //const recording = useQuestion2((state) => state.recording);
  const voteSelection = useQuestion4((state) => state.voteSelection);
  const pages = useDynamicPageStore((state) => state.pages);
  const adminName = useQuestion5Admin((state) => state.adminName);
  const percent = useQuestion5Vote((state) => state.percent);
  const language = useJurisdiction((state) => state.language);
  const jurisdiction = useJurisdiction((state) => state.jurisdiction);
  const { t } = useTranslation("both/pdf");
  const setCid = useQuestion1((state) => state.setCid);
  const names: string[] = [];
  const emails: string[] = [];
  const akas: string[] = [];
  const ipis: string[] = [];
  const addresses: string[] = [];
  const ids: string[] = [];
  const publishers: string[] = [];

  const generatePDF = async () => {
    const doc = new jsPDF();

    const getY = (y: number, inc: number) => {
      if (y > 220) {
        //new page is needed
        doc.addPage();
        return 30;
      } else {
        //need to increment y
        return y + inc;
      }
    };

    let x = 0;
    let y = 20;

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(15);

    const title = t("1");
    const splitTitle = doc.splitTextToSize(
      title,
      doc.internal.pageSize.getWidth() * 0.6
    );
    x = getX(title);
    doc.text(splitTitle, x, y);
    y = getY(y, 30);

    doc.setFont("Palatino Linotype", "normal");
    doc.setFontSize(11);
    const line1 = t("2", { date });
    doc.text(line1, x, y);
    y = getY(y, 15);

    //list collaborator info
    Object.keys(pages).forEach((id) => {
      const pageData = pages[Number(id)];
      if (pageData.legalName != "") {
        doc.setFont("Palatino Linotype", "bold");
        doc.text(t("6", { id }), x, y);
        y = getY(y, 5);
        doc.setFont("Palatino Linotype", "normal");
        const name = pageData.legalName;
        names.push(name);
        doc.text(t("7", { name }), x, y);
        y = getY(y, 5);
        const email = pageData.email;
        emails.push(email);
        doc.text(t("9", { email }), x, y);
        y = getY(y, 5);
        const contributorType = pageData.contributorType;
        const masterContributorType = pageData.masterContributorType;
        doc.text(t("10", { contributorType, masterContributorType }), x, y);
        y = getY(y, 5);
        const split = pageData.split;
        doc.text(t("11", { split }), x, y);
        y = getY(y, 5);
        const aka = pageData.aka;
        if(aka!=''){
          doc.text(t("aka", { aka }), x, y);
          y = getY(y, 5);
        }
        akas.push(aka.toString());
        const ipi = pageData.ipi;
        if(ipi!=''){
        doc.text(t("ipi", { ipi }), x, y);
        y = getY(y, 5);
        }
        ipis.push(ipi);
        const address = pageData.address;
        if(address!=''){
        doc.text(t("address", { address }), x, y);
        y = getY(y, 5);
        }
        addresses.push(address);
        const idNum = pageData.id;
        if(idNum!=''){
        doc.text(t("id", { idNum }), x, y);
        y = getY(y, 5);
        }
        ids.push(id);
        const publisher = pageData.producer;
        if(publisher!=''){
        doc.text(t("publisher", { publisher }), x, y);
        y = getY(y, 5);
        }
        publishers.push(publisher);
        y = getY(y,10);
      }

    });

    doc.setFont("Palatino Linotype", "bold");
    const line2 = t("3");
    doc.text(line2, x, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line3 = t("4", { song });
    const split3 = doc.splitTextToSize(
      line3,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split3, x, y);
    y = getY(y, 15);

    // const line3_5 = t("5a");
    // const split3_5 = doc.splitTextToSize(
    //   line3_5,
    //   doc.internal.pageSize.getWidth() * 0.6
    // );
    // doc.text(split3_5, x, y + 10);
    // y = getY(y, 30);

    doc.setFont("Palatino Linotype", "bold");
    const line4 = t("4a");
    doc.text(line4, x, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line5 = t("4b", { song });
    const split5 = doc.splitTextToSize(
      line5,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split5, x, y);
    y = getY(y, 20);

    // const line6 = t("5b");
    // const split6 = doc.splitTextToSize(
    //   line6,
    //   doc.internal.pageSize.getWidth() * 0.6
    // );
    // doc.text(split6, x / 2, y + 10);
    // y = getY(y, 30);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line7 = t("12");

    doc.text(line7, x, y);

    doc.setFont("Palatino Linotype", "normal");
    const line8 = t("13");
    const split8 = doc.splitTextToSize(
      line8,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split8, x , y + 10);
    y = getY(y, 35);

    const line9 = t("14");
    const split9 = doc.splitTextToSize(
      line9,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split9, x, y + 10);
    y = getY(y, 30);

    //different section based on vote or admin
    if (voteSelection == "VOTE") {
      const line10_5 = t("15", { percent });
      const split10_5 = doc.splitTextToSize(
        line10_5,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text(split10_5, x, y + 10);
      y = getY(y, 15);

      const line11_5 = t("16");
      const split11_5 = doc.splitTextToSize(
        line11_5,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text("-", x + 10, y + 10);
      doc.text(split11_5, x + 20, y + 10);
      y = getY(y, 10);

      const line12_5 = t("17");
      const split12_5 = doc.splitTextToSize(
        line12_5,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text("-", x  + 10, y + 10);
      doc.text(split12_5, x + 20, y + 10);
      y = getY(y, 15);

      const line13_5 = t("18a");
      const split13_5 = doc.splitTextToSize(
        line13_5,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text("-", x + 10, y + 10);
      doc.text(split13_5, x + 20, y + 10);
      y = getY(y, 15);

      const line14_5 = t("18b");
      const split14_5 = doc.splitTextToSize(
        line14_5,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text("-", x + 10, y + 10);
      doc.text(split14_5, x + 20, y + 10);
      y = getY(y, 15);

      const line9_5 = t("13b");
      const split9_5 = doc.splitTextToSize(
        line9_5,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text(split9_5, x, y + 10);
      y = getY(y, 30);

      const line10 = t("14b", { percent });
      const split10 = doc.splitTextToSize(
        line10,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text(split10, x, y + 10);
      y = getY(y, 15);

      const line11 = t("15b");
      const split11 = doc.splitTextToSize(
        line11,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text("-", x + 10, y + 10);
      doc.text(split11, x + 20, y + 10);
      y = getY(y, 10);

      const line12 = t("16b");
      const split12 = doc.splitTextToSize(
        line12,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text("-", x + 10, y + 10);
      doc.text(split12, x + 20, y + 10);
      y = getY(y, 10);

      const line13 = t("17b");
      const split13 = doc.splitTextToSize(
        line13,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text("-", x + 10, y + 10);
      doc.text(split13, x + 20, y + 10);
      y = getY(y, 15);

      const line14 = t("18c");
      const split14 = doc.splitTextToSize(
        line14,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text("-", x + 10, y + 10);
      doc.text(split14, x + 20, y + 10);
      y = getY(y, 25);
    } else if(voteSelection == "ADMIN") {
      const line10 = t("19a", { adminName });
      const split10 = doc.splitTextToSize(
        line10,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text(split10, x, y + 10);
      y = getY(y, 45);

      const line11 = t("19b");
      const split11 = doc.splitTextToSize(
        line11,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text(split11, x, y + 10);
      y = getY(y, 30);

      const line12 = t("19c", { adminName });
      const split12 = doc.splitTextToSize(
        line12,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text(split12, x, y + 10);
      y = getY(y, 55);
    }
    else{
      y = getY(y,10)
    }

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line15 = t("20");
    doc.text(line15, x, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line16 = t("21");
    const split16 = doc.splitTextToSize(
      line16,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split16, x, y);
    y = getY(y, 25);

    const line17 = t("22");
    const split17 = doc.splitTextToSize(
      line17,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split17, x, y);
    y = getY(y, 50);

    const line18 = t("23");
    const split18 = doc.splitTextToSize(
      line18,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split18, x, y);
    y = getY(y, 40);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line19 = t("24");
    doc.text(line19, x, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line20 = t("25");
    const split20 = doc.splitTextToSize(
      line20,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split20, x, y);
    y = getY(y, 25);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line21 = t("26");
    doc.text(line21, x, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line22 = t("27");
    const split22 = doc.splitTextToSize(
      line22,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split22, x, y);
    y = getY(y, 55);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line23 = t("28");
    doc.text(line23, x, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line24 = t("29");
    const split24 = doc.splitTextToSize(
      line24,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split24, x, y);
    y = getY(y, 40);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line25 = t("30");
    doc.text(line25, x, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line26 = t("31");
    const split26 = doc.splitTextToSize(
      line26,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split26, x, y);
    if(language=='en'){
      y = getY(y,25);
    }else{
      y = getY(y, 50);
    }
    

    // const line27 = t("32");
    // const split27 = doc.splitTextToSize(
    //   line27,
    //   doc.internal.pageSize.getWidth() * 0.6
    // );
    // doc.text("b.", x / 2, y);
    // doc.text(split27, x / 2 + 10, y);
    // y = getY(y, 15);

    // const line28 = t("33");
    // const split28 = doc.splitTextToSize(
    //   line28,
    //   doc.internal.pageSize.getWidth() * 0.6
    // );
    // doc.text(split28, x, y);
    // y = getY(y, 30);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line29 = t("34");
    doc.text(line29, x, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line30 = t("35");
    const split30 = doc.splitTextToSize(
      line30,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split30, x, y);
    y = getY(y, 30);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line31 = t("36");
    doc.text(line31, x, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line32 = t("37");
    const split32 = doc.splitTextToSize(
      line32,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split32, x, y);
    y = getY(y, 35);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line33 = t("38");
    doc.text(line33, x, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line34 = t("39");
    const split34 = doc.splitTextToSize(
      line34,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split34, x, y);
    y = getY(y, 20);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line35 = t("40");
    doc.text(line35, x, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    if(jurisdiction!=''){
      const line36 = t("41", {jurisdiction});
      const split36 = doc.splitTextToSize(
      line36,
      doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text(split36, x, y);
      y = getY(y, 20);

    }
    

    const line37 = t("42");
    const split37 = doc.splitTextToSize(
      line37,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split37, x, y);
    y = getY(y, 30);

    doc.text(t("43"), x, y);
    y = getY(y, 15);
    Object.keys(pages).forEach((id) => {
      const pageData = pages[Number(id)];
      if (pageData.legalName != "") {
        doc.setFont("Palatino Linotype", "bold");
        doc.text(t("6", { id }), x, y);
        y = getY(y, 5);
        doc.setFont("Palatino Linotype", "normal");
        const name = pageData.legalName;
        doc.text(t("7", { name }), x, y+5);
        doc.line(x + 20, y + 6, x + 155, y + 6);
        y = getY(y, 5);
        doc.text(t("44")+ id+":", x, y+14);
        doc.line(x + 20, y +15, x + 110, y + 15);
        doc.text(t("45", { date }), x + 115, y+14);
        doc.line(x + 125, y + 15, x + 155, y + 15);
        y = getY(y, 25);

        
      }
    });

    const pdfBlob = doc.output("blob");
    const docTitle = "Splits+" + song + ".pdf";
    doc.save(docTitle);

    const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

    async function pinFileToIPFS() {
      try {
        const blob = new Blob([pdfBlob], { type: "application/pdf" });
        const file = new File([blob], "contract.txt");
        const data = new FormData();
        data.append("file", file);

        const request = await fetch(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${JWT}`,
            },
            body: data,
          }
        );

        const response = await request.json();
        console.log(response);
        console.log(response.IpfsHash);

        const cid = response.IpfsHash; // Get the CID from the response
        setCid(cid);
        const userId = uuidv4(); // Generate UUID here

        // Now post the userId and CID to Supabase if song is not 'test'
        if(song!='test'){

          const { data: supabaseData, error } = await supabase
          .from("contracts") // Replace with your actual table name
          .insert([
            {
              id: userId, // Store userId
              emails: emails,
              names: names,
              download_clicked: isClicked,
              ipfs_cid: cid, // Store CID
              jurisdiction:jurisdiction,
              language:language,
              path: "both "+voteSelection,
              aka: akas,
              ipi: ipis,
              address: addresses,
              ids: ids,
              publishers: publishers,
              song: song,
            },
          ]);

          if (error) {
            console.error("Error storing data in Supabase:", error);
          } else {
            console.log("Data stored in Supabase:", supabaseData);
          }

        }

      } catch (error) {
        console.error(
          "Error during IPFS file pinning or Supabase storage:",
          error
        );
      }
    }
    await pinFileToIPFS();
  };

  return generatePDF;
};

export default PDF;
