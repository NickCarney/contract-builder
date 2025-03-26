// const fetch = require('node-fetch');

const generateAccessToken = async (jwt) => {
    const response = await fetch('https://account.docusign.com/oauth/token', {
        method: 'POST',
        headers: {
          'User-Agent': 'DocusignCopilot/0.0.1',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
      });

      const data = await response.json();
      return data.access_token;
};

module.exports = generateAccessToken;