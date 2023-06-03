require("dotenv").config({ path: "../.env" });
const express = require("express");
const fs = require("fs");

const app = express();

app.use("/", express.static("."));

const wasmCode = fs.readFileSync(
  "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\Lab_30\\p.wasm"
);

const wasmImports = {}; // используется для обеспечения импорта в модуль WebAssembly во время создания экземпляра.
const wasmModule = new WebAssembly.Module(wasmCode); // переменная wasmCode будет содержать двоичный код или ArrayBuffer, представляющий скомпилированный модуль WebAssembly
const wasmInstance = new WebAssembly.Instance(wasmModule, wasmImports); // создает экземпляр модуля WebAssembly с использованием WebAssembly.
// Конструктор экземпляра. Он принимает ранее созданный wasmModule и объект wasmImports в качестве параметров.
// Объект wasmImports может содержать объекты JavaScript или функции, к которым модуль WebAssembly может получить доступ в качестве импорта.

app.get("/", (req, res, next) => {
  res
    .type("html")
    .send(
      `<p>sum(22, 22) = ${wasmInstance.exports.sum(22, 22)}</p>` +
        `<p>mul(22, 22) = ${wasmInstance.exports.mul(22, 22)}</p>` +
        `<p>sub(22, 22) = ${wasmInstance.exports.sub(22, 22)}</p>`
    );
});

app.listen(3000, () => {
  console.log(`Server started on port 3000`);
});
