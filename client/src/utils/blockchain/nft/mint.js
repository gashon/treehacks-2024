import fetch from 'node-fetch';
import { crossmintAPIKey, pinataGatewayurl } from '../secrets.json';

export async function mintNFT(recipientEmail, audio_name) {
  const ipfshash = 'QmTGBQwFc1SdYvKD53eMqdMVGsRtTqS1kmRCvQDQY7n8Mv';

  const apiKey = crossmintAPIKey;
  const chain = 'polygon';
  const env = 'www';
  const recipientAddress = `email:${recipientEmail}:${chain}`;

  const audio_url = pinataGatewayurl + '/ipfs/' + ipfshash;
  const image =
    pinataGatewayurl + '/ipfs/QmT5yGY7AMedHbENeUrnbcFA6Wr9pgnUAtTZ6qoqtu4UQV';

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
        // animation_url:
        //   'https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_100KB_MP3.mp3',
        description: 'Owns ' + audio_name + '. Verified by Sonoverse.',
      },
    }),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error('error:' + err));
}

// mintNFT(
//   'hello@gmail.com',
//   'Part 1.m4a',
//   'QmTGBQwFc1SdYvKD53eMqdMVGsRtTqS1kmRCvQDQY7n8Mv'
// );
