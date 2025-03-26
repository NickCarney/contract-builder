// eslint-disable-next-line @typescript-eslint/no-require-imports
const docusign = require('docusign-esign');



const sendDocusign = async (accessToken, song, cid, names, emails) => {
    if(cid==''){
        console.log('No CID');
        console.error('Error creating envelope: CID');
    }
    // Configuration
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath('https://na4.docusign.net/restapi');
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);

    // Create the envelope definition
    const envelopeDefinition = new docusign.EnvelopeDefinition();
    envelopeDefinition.emailSubject = 'MESA - Splits signature reminder: '+song;
    envelopeDefinition.status = 'sent';

    // Read the document to be signed
    const ipfsGateway = `https://mesa.mypinata.cloud/ipfs/${cid}`;
    const response = await fetch(ipfsGateway);
    const pdfBuffer = await response.arrayBuffer();
    const base64Doc = Buffer.from(pdfBuffer).toString('base64');

    // Create the document object
    const document = new docusign.Document();
    document.documentBase64 = base64Doc;
    document.name = 'MESA - Splits signature reminder: '+ song;
    document.fileExtension = 'pdf';
    document.documentId = '1';

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

    // Create a signHere tab for the signer
    const signHere = new docusign.SignHere();
    signHere.anchorString = 'Signature'+(index+1).toString()+":";
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

    // Send the envelope
    const envelopesApi = new docusign.EnvelopesApi(apiClient);
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

    envelopesApi.createEnvelope(accountId, { envelopeDefinition })
    .then((result) => {
        console.log(`Envelope created with ID: ${result.envelopeId}`);
    })
    .catch((error) => {
        console.error('Error creating envelope:', error);
    });
}

module.exports = sendDocusign;