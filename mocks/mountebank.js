const mb = require('mountebank');
const axios = require('axios');
const fs = require('fs');

const startMountebank = async () => {
  await mb.create({
    port: 2525,
    pidfile: './mb.pid',
    logfile: './mb.log',
    protofile: './mb.json',
  });

  //load file mocks configs and add to stubs[]
  const POST_config_200 = JSON.parse(fs.readFileSync('./mocks/configs/POST-config-200.json', 'utf8'));
  const POST_config_400_missing_username = JSON.parse(fs.readFileSync('./mocks/configs/POST-config-missing-username.json', 'utf8'));
  const POST_config_400_missing_DOB = JSON.parse(fs.readFileSync('./mocks/configs/POST-config-missing-DOB.json', 'utf8'));
  const POST_config_400_invalid_sub = JSON.parse(fs.readFileSync('./mocks/configs/POST-config-invalid-sub.json', 'utf8'));
  const POST_config_400_invalid_gender = JSON.parse(fs.readFileSync('./mocks/configs/POST-config-invalid-gender.json', 'utf8'));
  const POST_config_400_invalid_DOB = JSON.parse(fs.readFileSync('./mocks/configs/POST-config-invalid-DOB.json', 'utf8'));

  const GET_config_200 = JSON.parse(fs.readFileSync('./mocks/configs/GET-config-200.json', 'utf8'));
  const GET_config_404 = JSON.parse(fs.readFileSync('./mocks/configs/GET-config-404.json', 'utf8'));

  const imposter = {
    port: 3000,
    protocol: 'http',
    stubs: [
      POST_config_400_invalid_DOB,
      POST_config_400_invalid_sub,
      POST_config_400_invalid_gender,
      POST_config_400_missing_DOB,
      POST_config_400_missing_username,
      POST_config_200,
      GET_config_404,
      GET_config_200
    ]
  };

  try {
    // Post the imposter to Mountebank using axios
    const response = await axios.post('http://localhost:2525/imposters', imposter);
    console.log('Mock server running on http://localhost:3000');
    console.log('Response from Mountebank:', response.data);
  } catch (error) {
    console.error('Error posting imposter to Mountebank:', error.message);
  }
};

startMountebank().catch((err) => {
  console.error('Error starting Mountebank:', err);
});