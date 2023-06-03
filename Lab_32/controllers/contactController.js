const contactService = require('../services/contactService');

module.exports = 
{
    async getAllContacts(req, res) 
    {
        const contacts = await contactService.getAllContacts();
        res.type('json');
        res.end(JSON.stringify(contacts))
    },

    async addContact(req, res) {
        if (req.body.name && req.body.phone) 
        {
            const contact = await contactService.addContact(req.body);
            res.type('json');
            res.end(JSON.stringify(contact));
        } else 
        {
            res.status(400).end('Parameters not found');
        }
    },

    async editContact(req, res) {
        if (req.body.id && req.body.name && req.body.phone) 
        {
            const contact = await contactService.editContact(req.body);
            res.type('json');
            res.end(JSON.stringify(contact));
        } else 
        {
            res.status(400).end('Parameters not found');
        }
    },

    async deleteContact(req, res) 
    {
        if (req.query.id) 
        {
            const contacts = contactService.deleteContact(req.query.id);
            res.type('json');
            res.end(JSON.stringify(contacts));
        } else 
        {
            res.status(400).end('Parameters not found');
        }
    }
};
