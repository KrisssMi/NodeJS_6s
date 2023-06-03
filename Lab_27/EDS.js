const crypto = require("crypto");
function serverSign(rs, cb) {
  // rs - это поток, который мы будем подписывать
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "pkcs1", format: "pem" },
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
  });
  const _sign = crypto.createSign("SHA256"); // создаем объект для подписи

  rs.pipe(_sign);
  rs.on("end", () => {
    cb({
      signature: _sign.sign(privateKey).toString("hex"), // позволяет подписать данные
      publicKey: publicKey.toString("hex"), // публичный ключ
    });
  });
}

function clientVerify(signContext, rs, cb) {
  // signContext - это контекст подписи, который мы получили от сервера
  const _verify = crypto.createVerify("SHA256");

  rs.pipe(_verify);
  rs.on("end", () => {
    cb(_verify.verify(signContext.publicKey, "rgrdrd", "hex"));
  });
}

module.exports.serverSign = serverSign;
module.exports.clientVerify = clientVerify;
