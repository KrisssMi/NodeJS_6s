const crypto = require("crypto");

// serverDH - это серверный объект, который генерирует ключи
// clientDH - это клиентский объект, который генерирует ключи
function serverDH(len_a, g) {
  // len_a - это длина ключа в байтах, g - это генератор
  const dh = crypto.createDiffieHellman(len_a, g);
  const p = dh.getPrime();
  const gb = dh.getGenerator();
  const k = dh.generateKeys();

  this.getContext = () => {
    return {
      p_hex: p.toString("hex"),
      g_hex: gb.toString("hex"),
      key_hex: k.toString("hex"),
    };
  };

  this.getSecret = (clientContext) => {
    const k = Buffer.from(clientContext.key_hex, "hex"); // Buffer.from() - это преобразование строки в буфер
    return dh.computeSecret(k); // computeSecret() - это вычисление секрета
  };
}

function clientDH(serverContext) {
  const ctx = {
    p_hex: serverContext.p_hex,
    g_hex: serverContext.g_hex,
  };

  const p = Buffer.from(ctx.p_hex, "hex");
  const g = Buffer.from(ctx.g_hex, "hex");
  const dh = crypto.createDiffieHellman(p, g);
  const k = dh.generateKeys();

  this.getContext = () => {
    return {
      p_hex: p.toString("hex"),
      g_hex: g.toString("hex"),
      key_hex: k.toString("hex"),
    };
  };

  this.getSecret = (clientContext) => {
    const k = Buffer.from(clientContext.key_hex, "hex");
    return dh.computeSecret(k);
  };
}

module.exports.SDH = serverDH;
module.exports.CDH = clientDH;
