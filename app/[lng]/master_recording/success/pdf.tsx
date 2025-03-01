import { jsPDF } from "jspdf";

import useQuestion1 from "../../store/useQuestion1";
import useQuestion2 from "../../store/useQuestion2";
//import useQuestion3 from '../../store/useQuestion3'; //NOT USED
import useQuestion4 from "../../store/useQuestion4";
import useDynamicPageStore from "../../store/use[page]";
import useQuestion5Admin from "../../store/useQuestion5Admin";
import useQuestion5Vote from "../../store/useQuestion5Vote";
import useJurisdiction from "../../store/useJurisdiction";
import useStory from "../../store/useStory";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { RegisterIP } from "../../utils/registerIP";

const getX = (text: string) => {
  let x = 50;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const width = doc.getTextWidth(text);
  x = (pageWidth - width) / 2;
  return Math.abs(x);
};

const PDF = (isClicked: boolean) => {
  const date = useQuestion1((state) => state.date);
  const song = useQuestion2((state) => state.song);
  const recording = useQuestion2((state) => state.recording);
  const voteSelection = useQuestion4((state) => state.voteSelection);
  const pages = useDynamicPageStore((state) => state.pages);
  const adminName = useQuestion5Admin((state) => state.adminName);
  const percent = useQuestion5Vote((state) => state.percent);
  const language = useJurisdiction((state) => state.language);
  const jurisdiction = useJurisdiction((state) => state.jurisdiction);
  const address = useStory((state) => state.address);
  const { t } = useTranslation("master_recording/pdf");
  const setCid = useQuestion1((state) => state.setCid);
  const names: string[] = [];
  const emails: string[] = [];
  const akas: string[] = [];
  const addresses: string[] = [];
  const ids: string[] = [];

  async function convertPdf(cid:string) {
    const response = await fetch("/en/api/convertPdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pdfUrl: `https://ipfs.io/ipfs/${cid}` }),
    });
  
    const data = await response.json();
    if (data.success) {
      console.log("Image saved at:", data.imagePath);
    } else {
      console.error("Conversion failed:", data.error);
    }
    return data.imagePath;
  }

  const generatePDF = async () => {
    const doc = new jsPDF();

    const getY = (y: number, inc: number) => {
      if (y > 230) {
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
    doc.setFontSize(11);

    const title = t("title");
    const splitTitle = doc.splitTextToSize(
      title,
      doc.internal.pageSize.getWidth() * 0.6
    );
    x = getX(title);
    x = 2;
    doc.text(splitTitle, 50, y);
    y = getY(y, 30);

    doc.setFont("Palatino Linotype", "normal");
    const line1 = t("agreement_date", { date });
    x = 50;
    doc.text(line1, x, y);
    y = getY(y, 15);

    //useDynamicPageStore
    x = 30;
    Object.keys(pages).forEach((id) => {
      const pageData = pages[Number(id)];
      if (pageData.legalName != "") {
        doc.setFont("Palatino Linotype", "bold");
        doc.text(t("collaborator_id", { id }), x, y);
        y = getY(y, 5);
        doc.setFont("Palatino Linotype", "normal");
        const name = pageData.legalName;
        names.push(name);
        doc.text(t("legal_name", { name }), x, y);
        y = getY(y, 5);
        const email = pageData.email;
        emails.push(email);
        doc.text(t("email_address", { email }), x, y);
        y = getY(y, 5);
        const contributorType = pageData.contributorType;
        doc.text(t("contribution_type", { contributorType }), x, y);
        y = getY(y, 5);
        const split = pageData.split;
        doc.text(t("ownership_percentage", { split }), x, y);
        y = getY(y, 5);

        const aka = pageData.aka;
        if(aka!=''){
          doc.text(t("aka", { aka }), x, y);
          y = getY(y, 5);
        }
        akas.push(aka.toString());
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
        ids.push(idNum);
        y = getY(y,10);
      }
    });

    doc.setFont("Palatino Linotype", "bold");
    const line2 = t("musical_work_identification");
    x = getX(line2);
    doc.text(line2, x / 2, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line3 = t("musical_work_details", { song });
    const split3 = doc.splitTextToSize(
      line3,
      doc.internal.pageSize.getWidth() * 0.6
    );
    x = getX(line3);
    doc.text(split3, 30, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "bold");
    const line4 = t("recording_identification");
    x = getX(line4);
    doc.text(line4, 30, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line5 = t("recording_details", { recording });
    const split5 = doc.splitTextToSize(
      line5,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split5, 30, y);
    y = getY(y, 25);

    // const line6 = t("5");
    // const split6 = doc.splitTextToSize(
    //   line6,
    //   doc.internal.pageSize.getWidth() * 0.6
    // );
    // doc.text(split6, 30, y + 10);
    // y = getY(y, 30);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line7 = t("rights_and_duties");
    x = getX(line7);
    doc.text(line7, x / 2, y);

    doc.setFont("Palatino Linotype", "normal");
    const line8 = t("mutual_assignment");
    const split8 = doc.splitTextToSize(
      line8,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split8, x / 2, y + 10);
    y = getY(y, 30);

    const line9 = t("joint_work");
    const split9 = doc.splitTextToSize(
      line9,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split9, x / 2, y + 10);
    y = getY(y, 25);

    //different section based on vote or admin
    if (voteSelection == "VOTE") {
      const line10 = t("authorization_requirement", { percent });
      const split10 = doc.splitTextToSize(
        line10,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text(split10, x / 2, y + 10);
      y = getY(y, 15);

      const line11 = t("exploitation_restriction");
      const split11 = doc.splitTextToSize(
        line11,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text("-", x / 2, y + 10);
      doc.text(split11, x / 2 + 20, y + 10);
      y = getY(y, 10);

      const line12 = t("modification_restriction");
      const split12 = doc.splitTextToSize(
        line12,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text("-", x / 2, y + 10);
      doc.text(split12, x / 2 + 20, y + 10);
      y = getY(y, 10);

      const line13 = t("commercial_exploitation_restriction");
      const split13 = doc.splitTextToSize(
        line13,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text("-", x / 2, y + 10);
      doc.text(split13, x / 2 + 20, y + 10);
      y = getY(y, 15);

      const line14 = t("licensing_restriction");
      const split14 = doc.splitTextToSize(
        line14,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text("-", x / 2, y + 10);
      doc.text(split14, x / 2 + 20, y + 10);
      y = getY(y, 35);
    } else if (voteSelection == "ADMIN") {
      const line10 = t("admin_designation", { adminName });
      const split10 = doc.splitTextToSize(
        line10,
        doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text(split10, x / 2, y + 10);
      if(language=='en'){
        y = getY(y, 60);
      }else{
        y = getY(y, 40);
      }

      // const line10a = t("admin_responsibilities");
      // const split10a = doc.splitTextToSize(
      //   line10a,
      //   doc.internal.pageSize.getWidth() * 0.6
      // );
      // doc.text("-", x, y + 10);
      // doc.text(split10a, x / 2, y + 10);
      // y = getY(y, 45);
    } else {
      y = getY(y, 10);
    }

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line15 = t("distribution_and_monetization");
    //x = getX(line15);
    doc.text(line15, x / 2, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line16 = t("distributor_selection");
    const split16 = doc.splitTextToSize(
      line16,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split16, x / 2, y);
    y = getY(y, 25);

    const line17 = t("royalty_collection");
    const split17 = doc.splitTextToSize(
      line17,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split17, x / 2, y);
    y = getY(y, 45);

    const line18 = t("third_party_payments");
    const split18 = doc.splitTextToSize(
      line18,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split18, x / 2, y);
    y = getY(y, 35);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line19 = t("credits");
    doc.text(line19, x / 2, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line20 = t("credit_presentation");
    const split20 = doc.splitTextToSize(
      line20,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split20, x / 2, y);
    y = getY(y, 25);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line21 = t("artist_license");
    doc.text(line21, x / 2, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line22 = t("license_details");
    const split22 = doc.splitTextToSize(
      line22,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split22, x / 2, y);
    y = getY(y, 50);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line23 = t("accounting");
    doc.text(line23, x / 2, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line24 = t("audit_rights");
    const split24 = doc.splitTextToSize(
      line24,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split24, x / 2, y);
    y = getY(y, 40);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line25 = t("full_capacity");
    doc.text(line25, x / 2, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line26 = t("capacity_declaration");
    const split26 = doc.splitTextToSize(
      line26,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split26, x / 2, y);
    y = getY(y, 20);

    const line27 = t("original_contributions");
    const split27 = doc.splitTextToSize(
      line27,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split27, x / 2, y);
    y = getY(y, 15);

    const line28 = t("indemnity");
    const split28 = doc.splitTextToSize(
      line28,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split28, x / 2, y);
    y = getY(y, 30);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line29 = t("full_autonomy");
    doc.text(line29, x / 2, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line30 = t("autonomy_declaration");
    const split30 = doc.splitTextToSize(
      line30,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split30, x / 2, y);
    y = getY(y, 30);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line31 = t("right_of_first_refusal");
    doc.text(line31, x / 2, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line32 = t("first_refusal_details");
    const split32 = doc.splitTextToSize(
      line32,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split32, x / 2, y);
    y = getY(y, 35);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line33 = t("notices");
    doc.text(line33, x / 2, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    const line34 = t("notice_details");
    const split34 = doc.splitTextToSize(
      line34,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split34, x / 2, y);
    y = getY(y, 20);

    doc.setFont("Palatino Linotype", "bold");
    doc.setFontSize(11);
    const line35 = t("dispute_settlement");
    doc.text(line35, x / 2, y);
    y = getY(y, 10);

    doc.setFont("Palatino Linotype", "normal");
    if(jurisdiction!=''){
      const line36 = t("dispute_details", {jurisdiction});
      const split36 = doc.splitTextToSize(
      line36,
      doc.internal.pageSize.getWidth() * 0.6
      );
      doc.text(split36, x / 2, y);
      y = getY(y, 20);

    }
    

    const line37 = t("agreement_modification");
    const split37 = doc.splitTextToSize(
      line37,
      doc.internal.pageSize.getWidth() * 0.6
    );
    doc.text(split37, x / 2, y);
    y = getY(y, 30);

    doc.text(t("signatures"), x, y);
    y = getY(y, 15);
    x /= 2;
    Object.keys(pages).forEach((id) => {
      const pageData = pages[Number(id)];
      if (pageData.legalName != "") {
        doc.setFont("Palatino Linotype", "bold");
        doc.text(t("collaborator_id", { id }), x, y);
        y = getY(y, 5);
        doc.setFont("Palatino Linotype", "normal");
        const name = pageData.legalName;
        doc.text(t("legal_name", { name }), x, y);
        doc.line(x + 27, y + 1, x + 150, y + 1);
        y = getY(y, 5);
        doc.text(t("signature"), x, y);
        doc.line(x + 10, y + 1, x + 80, y + 1);
        doc.text(t("signature_date", { date }), x + 85, y);
        doc.line(x + 95, y + 1, x + 132, y + 1);
        y = getY(y, 15);
      }
    });

    const pdfBlob = doc.output("blob");
    const docTitle = "Splits+" + song + ".pdf";
    doc.save(docTitle);

    const JWT = process.env.NEXT_PUBLIC_PINATA_JWT!;

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
        //console.log(response);
        //console.log(response.IpfsHash);

        const cid = response.IpfsHash; // Get the CID
        setCid(cid);
        const userId = uuidv4(); // Generate UUID

        // post the userId and CID to Supabase
        const { data: supabaseData, error } = await supabase
          .from("contracts")
          .insert([
            {
              id: userId, // Store userId
              emails: emails,
              names: names,
              download_clicked: isClicked,
              ipfs_cid: cid, // Store CID
              jurisdiction:jurisdiction,
              language:language,
              path: "master "+voteSelection,
              aka: akas,
              address: addresses,
              ids: ids,
            },
          ]);

          //console.log("about to convert pdf with "+cid);
          const res = await convertPdf(cid);
          //console.log(res);

          //console.log("about to register ip with "+res+address+song+cid+pages);
          await RegisterIP(res, address, song, cid, pages);

        if (error) {
          console.error("Error storing data in Supabase:", error);
        } else {
          console.log("Data stored in Supabase:", supabaseData);
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
