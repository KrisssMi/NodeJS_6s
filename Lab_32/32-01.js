const express = require('express');
const bodyParser = require('body-parser');
const swaggerUI = require('swagger-ui-express');
const yaml = require('yamljs');
const path = require('path');

const app = express();
const port = 3000;

const swaggerDocument = yaml.load(path.join(__dirname, './doc/api.yaml'));
const contactRouter = require('./routers/contactRouter');

app
    .use(express.json())
    .use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
    .use(bodyParser.json())
    .use('/ts', contactRouter);

app.listen(port, () => {
    console.log(`http://localhost:${port}/doc`);
});
