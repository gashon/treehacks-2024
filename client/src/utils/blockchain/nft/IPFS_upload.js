const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const JWT =
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    .eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MDE0N2I0My00ZDdlLTQ2NjAtOTc4ZS02NTEzMGNhMmJkYmUiLCJlbWFpbCI6ImphZGhhdmFtZXlha0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOTgwY2Y1MWM1MzNlYjA1ZjM2MzYiLCJzY29wZWRLZXlTZWNyZXQiOiI5NTdkMTFkOWM3Y2M2ZWJjNDVmNTAwNDhhMjYzNDhiNGViMDVkN2E0YTM3NjUxNTBjNDg1MTc4NDRiMjVjYmU2IiwiaWF0IjoxNzA4MjAwODE0fQ
    ._7PkPoR7EWhVdX5hpoNKQiAmBKcnx6c2ba3m_oJ7hMM;
const {
  privateKey,
  calderaRPCUrl,
  calderaChainId,
} = require('../secrets.json');

const pinFileToIPFS = async (mediaUrl) => {
  const formData = new FormData();
  const src = 'path/to/file.png';

  const file = fs.createReadStream(src);
  formData.append('file', file);

  const pinataMetadata = JSON.stringify({
    name: 'File name',
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
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};
pinFileToIPFS();
