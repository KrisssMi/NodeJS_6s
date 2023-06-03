require("dotenv").config({ path: ".env" });
const axios = require("axios");
const fs = require("fs");

const { clientVerify } = require("./EDS");

const verify = async () => {
  try {
    const { data } = await axios.get(process.env.APP_BASE_URL);

    const rs = fs.createReadStream(`${__dirname}/server.txt`, {
      encoding: "utf8",
    });

    clientVerify(data, rs, (isVerified) => {
      // проверяем подпись
      console.log(`Is verified: ${isVerified}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};
verify();
