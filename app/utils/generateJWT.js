// utils/generateJWT.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const jwt = require('jsonwebtoken');

const integrationKey = process.env.DOCUSIGN_CLIENT_ID;
const userId = process.env.DOCUSIGN_USER_ID;
const currentTime = Math.floor(Date.now() / 1000);
// const publicKey = process.env.DOCUSIGN_PUBLIC_KEY; //NOT USED
const privateKey = process.env.DOCUSIGN_PRIVATE_KEY

// const privateKeyPath = path.join(__dirname, 'path/to/your/private.key');
// const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

const generateJWT = () => {
    const payload = {
        iss: integrationKey,
        sub: userId,
        aud: 'account-d.docusign.com', // DocuSign auth URL for sandbox (account.docusign.com for real deal)
        iat: currentTime,
        exp: currentTime + 6000,
        scope: 'signature impersonation',
      };

  const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
  return token;
};



module.exports = generateJWT;