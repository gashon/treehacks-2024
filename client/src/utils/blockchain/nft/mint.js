var fetch = require('node-fetch');
const { crossmintAPIKey } = require('../secrets.json');

async function mintNFT(recipientEmail, animation_url) {
  const apiKey = crossmintAPIKey;
  const chain = 'polygon';
  const env = 'www';
  const recipientAddress = `email:${recipientEmail}:${chain}`;

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
        name: 'Crossmint Test NFT',
        image: 'https://picsum.photos/400',
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
  'https://treehacks-2024.s3.us-west-1.amazonaws.com/Part+1.m4a'
);
