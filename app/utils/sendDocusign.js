// eslint-disable-next-line @typescript-eslint/no-require-imports
const docusign = require('docusign-esign');

const sendDocusign = async (accessToken, song, cid, names, emails, splitType, lng) => {
    if (cid === '') {
        console.error('Error creating envelope: CID');
        return;
    }
    console.log("past cid check");

    // Configuration
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath('https://na4.docusign.net/restapi');
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    console.log("past access token");

    // Create the envelope definition
    const envelopeDefinition = new docusign.EnvelopeDefinition();
    envelopeDefinition.emailSubject = `${song} ${splitType} ownership splits by MESA`;
    envelopeDefinition.status = 'sent';
    console.log("past env def");

    // Read the document from IPFS
    const ipfsGateway = `https://mesa.mypinata.cloud/ipfs/${cid}`;
    const response = await fetch(ipfsGateway);
    const pdfBuffer = await response.arrayBuffer();
    const base64Doc = Buffer.from(pdfBuffer).toString('base64');
    console.log("past pdf get");

    // Create the document object
    const document = new docusign.Document();
    document.documentBase64 = base64Doc;
    document.name = `${song} ${splitType} ownership splits by MESA`;
    document.fileExtension = 'pdf';
    document.documentId = '1';
    console.log("past doc");

    // Add the document to the envelope
    envelopeDefinition.documents = [document];

    // Define the recipients with Embedded Signing
    const recipients = [];
    const recipientEmails = emails;

    recipientEmails.forEach((email, index) => {
        if (email === '') return;

        const signer = new docusign.Signer();
        signer.email = emails[index];
        signer.name = names[index];
        signer.recipientId = (index + 1).toString();
        signer.clientUserId = `100${index + 1}`;   // 👈 Embedded Signing with unique ID

        console.log("signer", signer);

        // Create a signHere tab for the signer
        const signHere = new docusign.SignHere();
        signHere.anchorString = lng === 'en' 
            ? `Signature${index + 1}:` 
            : `Firma${index + 1}:`;
        signHere.anchorUnits = 'pixels';
        signHere.anchorXOffset = '64';
        signHere.anchorYOffset = '0';

        let tabs = new docusign.Tabs();
        tabs.signHereTabs = [signHere];
        signer.tabs = tabs;

        recipients.push(signer);
    });

    // Add the recipients to the envelope
    envelopeDefinition.recipients = new docusign.Recipients();
    envelopeDefinition.recipients.signers = recipients;

    console.log("past adding recipients", recipients);

    // Send the envelope
    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
    console.log("SENT ");

    try {
        const result = await envelopesApi.createEnvelope(accountId, { envelopeDefinition });
        console.log(`Envelope created with ID: ${result.envelopeId}`);

        // ✅ Create Embedded Signer Views with Redirect URLs
        const signerUrls = [];

        for (let i = 0; i < recipients.length; i++) {
            const viewRequest = new docusign.RecipientViewRequest();
            viewRequest.returnUrl = `https://contratos.mesawallet.io/success?envelopeId=${result.envelopeId}`;  // 👈 Custom redirect URL
            viewRequest.authenticationMethod = "none";
            viewRequest.email = recipients[i].email;
            viewRequest.userName = recipients[i].name;
            viewRequest.clientUserId = recipients[i].clientUserId;

            const recipientView = await envelopesApi.createRecipientView(
                accountId, 
                result.envelopeId, 
                { recipientViewRequest: viewRequest }
            );

            console.log(`Signing URL for ${recipients[i].email}: ${recipientView.url}`);
            signerUrls.push({ email: recipients[i].email, url: recipientView.url });
        }

        console.log("Signer URLs:", signerUrls);

        return signerUrls;  // Return all signer URLs with redirects

    } catch (err) {
        console.error(`Error creating envelope: ${err}`);

        const failResponse = await fetch(`https://contratos.mesawallet.io/en/api/send/docusignFail`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ songName: song, recipients: recipients }),
        });
        
        console.log(failResponse);
    }
};

module.exports = sendDocusign;
