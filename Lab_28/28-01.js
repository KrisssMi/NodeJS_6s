require("dotenv").config({ path: ".env" });
const app = require("express")();
const fs = require("fs");
const createClient = require("webdav").createClient;
const filesPath = "./files/";
const downPath = "./files/down/";

const client = createClient("https://webdav.yandex.ru", {
  username: process.env.WEBDAV_USERNAME,
  password: process.env.WEBDAV_PASSWORD,
});

app.post("/md/:name", async (req, res) => {
  try {
    const dirName = req.params.name;
    const dir = await client.exists(dirName);

    if (dir) {
      res.status(408).send({ message: "Already exists" });
      return;
    }

    await client.createDirectory(dirName);

    res.status(201).send({ message: "Created" });
  } catch (error) {
    res.status(408).send({ message: "Something run wrong" });
  }
});

app.post("/rd/:name", async (req, res) => {
  try {
    const dirName = req.params.name;
    const dir = await client.exists(dirName);

    if (!dir) {
      res.status(404).send({ message: "This dirertory doesn't exist" });
      return;
    }

    client.deleteFile(dirName);
    res.status(200).send({ message: "Deleted" });
  } catch (error) {
    res.status(408).send({ message: "Something run wrong" });
  }
});

app.post("/up/:name", async (req, res) => {
  try {
    const fileName = req.params.name;
    const localFilePath = filesPath + fileName;
    const readStream = fs.createReadStream(localFilePath);

    await client.putFileContents(fileName, readStream);

    res.status(200).send({ message: "Uploaded" });
  } catch (error) {
    res.status(408).send({ message: "Something run wrong" });
  }
});

app.post("/down/:name", async (req, res) => {
  try {
    const fileName = req.params.name;
    const localFilePath = downPath + fileName;
    const file = await client.exists(fileName);

    if (!file) {
      res.status(404).send({ message: "This file doesn't exist" });
      return;
    }

    const readStream = client.createReadStream(fileName);
    const writeStream = fs.createWriteStream(localFilePath);
    readStream.pipe(writeStream);
    res.status(200).send({ message: "Downloaded" });
  } catch (error) {
    res.status(408).send({ message: "Something run wrong" });
  }
});

app.post("/del/:name", async (req, res) => {
  try {
    const fileName = req.params.name;
    const file = await client.exists(fileName);

    if (!file) {
      res.status(404).send({ message: "This file doesn't exist" });
      return;
    }
    client.deleteFile(fileName);
    res.status(200).send({ message: "Deleted" });
  } catch (error) {
    res.status(408).send({ message: "Something run wrong" });
  }
});

app.post("/copy/:resource/:destination", async (req, res) => {
  try {
    const resourceName = req.params.resource;
    const destinationName = req.params.destination;
    const resource = await client.exists(resourceName);

    if (!resource) {
      res.status(404).send({ message: "This file doesn't exist" });
      return;
    }
    client.copyFile(resourceName, destinationName);
    res.status(200).send({ message: "Copied" });
  } catch (error) {
    res.status(408).send({ message: "Something run wrong" });
  }
});

app.post("/move/:resource/:destination", async (req, res) => {
  try {
    const resourceName = req.params.resource;
    const destinationName = req.params.destination;
    const resource = await client.exists(resourceName);

    if (!resource) {
      res.status(404).send({ message: "This file doesn't exist" });
      return;
    }
    client.moveFile(resourceName, destinationName);
    res.status(200).send({ message: "Moved" });
  } catch (error) {
    res.status(408).send({ message: "Something run wrong" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
