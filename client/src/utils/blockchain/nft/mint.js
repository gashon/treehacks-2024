var fetch = require('node-fetch');
const { crossmintAPIKey, pinataGatewayurl } = require('../secrets.json');

async function mintNFT(recipientEmail, audio_name, ipfshash) {
  const apiKey = crossmintAPIKey;
  const chain = 'polygon';
  const env = 'www';
  const recipientAddress = `email:${recipientEmail}:${chain}`;

  const image = pinataGatewayurl + '/ipfs/' + ipfshash;

  const url = `https://${env}.crossmint.com/api/2022-06-09/collections/default/nfts`;
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      recipient: recipientAddress,
      metadata: {
        name: audio_name,
        image,
        animation_url,
        description: 'My first NFT using Crossmint',
      },
    }),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error('error:' + err));
}

mintNFT(
  'jadhavameyak@gmail.com',
  'Part 1.m4a',
  'QmTGBQwFc1SdYvKD53eMqdMVGsRtTqS1kmRCvQDQY7n8Mv'
);
