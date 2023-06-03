const express = require('express');
const contactRouter = express.Router();
const contactController = require('../controllers/contactController');

contactRouter.get('/get', contactController.getAllContacts);
contactRouter.post('/post', contactController.addContact);
contactRouter.put('/put', contactController.editContact);
contactRouter.delete('/delete', contactController.deleteContact);

module.exports = contactRouter;
