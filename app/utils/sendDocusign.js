// eslint-disable-next-line @typescript-eslint/no-require-imports
const docusign = require('docusign-esign');



const sendDocusign = async (accessToken, song, cid, names, emails, splitType) => {
    // console.log("in sendDocusign:",cid, song, names, emails)
    if(cid===''){
        console.error('Error creating envelope: CID');
        return;
    }
    console.log("past cid check")
    // Configuration
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath('https://na4.docusign.net/restapi');
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    console.log("past access token")

    // Create the envelope definition
    const envelopeDefinition = new docusign.EnvelopeDefinition();
    envelopeDefinition.emailSubject = song+" "+splitType+' ownership splits by MESA';
    envelopeDefinition.status = 'sent';
    console.log("past env def")

    // Read the document to be signed
    const ipfsGateway = `https://mesa.mypinata.cloud/ipfs/${cid}`;
    const response = await fetch(ipfsGateway);
    const pdfBuffer = await response.arrayBuffer();
    const base64Doc = Buffer.from(pdfBuffer).toString('base64');
    console.log("past pdf get")

    // Create the document object
    const document = new docusign.Document();
    document.documentBase64 = base64Doc;
    document.name = song+" "+splitType+' ownership splits by MESA';
    document.fileExtension = 'pdf';
    document.documentId = '1';
    console.log("past doc")

    // Add the document to the envelope
    envelopeDefinition.documents = [document];

    // Define the recipients
    const recipients = [];
    const recipientEmails = emails;

    recipientEmails.forEach((email, index) => {
    if(email === '') return;
    const signer = new docusign.Signer();
    signer.email = emails[index];
    signer.name = names[index];
    signer.recipientId = (index + 1).toString();
    console.log("signer", signer)

    // Create a signHere tab for the signer
    const signHere = new docusign.SignHere();
    signHere.anchorString = 'Signature'+(index+1).toString()+":";
    signHere.anchorUnits = 'pixels';
    signHere.anchorXOffset = '64';
    signHere.anchorYOffset = '0';
    console.log("past anchor")

    let tabs = new docusign.Tabs();
    tabs.signHereTabs = [signHere];
    signer.tabs = tabs;
    console.log("past tabs")


    recipients.push(signer);
    });

    // Add the recipients to the envelope
    envelopeDefinition.recipients = new docusign.Recipients();
    envelopeDefinition.recipients.signers = recipients;
    console.log("past adding recipients", recipients)

    // Send the envelope
    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
    console.log("SENT ")

    const result = await envelopesApi.createEnvelope(accountId, { envelopeDefinition })
    console.log(`Envelope created with ID: ${result.envelopeId}`);
}

module.exports = sendDocusign;