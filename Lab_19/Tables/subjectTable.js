const {PrismaClient} = require("@prisma/client");
const client = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

// --------------------------------- GET ---------------------------------
async function getAllSubjects(req, res) {
  await client.SUBJECT.findMany()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(404).json({ error: "Subjects are not found" });
    });
}


// --------------------------------- POST ---------------------------------
async function postSubject(req, res) {
        if (await client.SUBJECT.findFirst({
            where: {
                SUBJECT: req.body.SUBJECT,
            },
        })
        ) {
            return res.status(400).json({ error: "Object with this primary key already exists" });
        }
        client.SUBJECT.create({
            data: req.body,
        })
            .then((result) => {
                res.status(201).json({ result });
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json({ error: "Reference to non-existent foreign key" });
            });
}


// --------------------------------- PUT ---------------------------------
async function putSubject(req, res) {
    if (!(await client.SUBJECT.findFirst({
        where: {
            SUBJECT: req.body.SUBJECT,
        },
    }))
    ) {
        return res.status(400).json({ error: "Object with this primary key doesn't exist" });
    }
    client.SUBJECT.update({
        where: {
            SUBJECT: req.body.SUBJECT,
        },
        data: req.body,
    })
        .then((result) => {
            res.status(200).json({result});
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Reference to non-existent foreign key" });
        });
}


// --------------------------------- DELETE ---------------------------------
async function deleteSubject(req, res) {
    if (!(await client.SUBJECT.findFirst({
        where: {
            SUBJECT: decodeURIComponent(req.params.xyz),
        },
    }))
    ) {
        return res.status(400).json({ error: "Object with this primary key doesn't exist" });
    }
    client.SUBJECT.delete({
        where: {
            SUBJECT: decodeURIComponent(req.params.xyz) },
    })
        .then((result) => {
            res.status(200).json({ result });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Reference to non-existent foreign key" });
        });
}

module.exports = { getAllSubjects, postSubject, putSubject, deleteSubject };