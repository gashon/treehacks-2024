const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const stream = require('stream');
const { promisify } = require('util');

const { pinataGatewayurl, pinataAPIKey } = require('../secrets.json');

const JWT = pinataAPIKey;

const pinFileToIPFS = async (fileUrl, audioName) => {
  const pipeStreamToPromise = (sourceStream, destStream) => {
    const finished = promisify(stream.finished);
    sourceStream.pipe(destStream);
    return finished(destStream);
  };

  const response = await axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  });

  const formData = new FormData();
  formData.append('file', response.data);

  const pinataMetadata = JSON.stringify({
    name: audioName,
  });
  formData.append('pinataMetadata', pinataMetadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', pinataOptions);

  try {
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );

    console.log(res.data.IpfsHash);

    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};
pinFileToIPFS(
  'https://treehacks-2024.s3.us-west-1.amazonaws.com/Part+1.m4a',
  'Part 1.m4a'
);
