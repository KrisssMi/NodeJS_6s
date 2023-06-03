const {PrismaClient} = require("@prisma/client");
const client = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

// --------------------------------- GET ---------------------------------
async function getAllPulpits(req, res) {
    await client.PULPIT.findMany()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(404).json({ error: "Pulpits are not found" });
        });
}

async function findPulpitsWithoutTeachers(req, res) {
    const result = await client.PULPIT.findMany({
        where: {
            TEACHER_TEACHER_PULPITToPULPIT: {
                none: {},
            },
        },
    });
    if (!result) {
        return res.status(404).json({ error: "This pulpits are not found" });
    } else res.send(result);
}

async function findPulpitsWithVladimir(req, res) {
    const result = await client.PULPIT.findMany({
        where: {
            TEACHER_TEACHER_PULPITToPULPIT: {
                some: {
                    TEACHER_NAME: {
                        contains: "Владимир ",
                    },
                },
            },
        },
    });
    if (!result) {
        return res.status(404).json({ error: "This pulpits are not found" });
    } else res.send(result);
}


// --------------------------------- POST ---------------------------------
async function postPulpit(req, res) {
    if (await client.PULPIT.findFirst({
        where: {
            PULPIT: req.body.PULPIT,
        },
    })
    ) {
        return res.status(400).json({ error: "Object with this primary key already exists" });
    }
    client.PULPIT.create({
        data: {
            PULPIT: req.body.PULPIT,
            PULPIT_NAME: req.body.PULPIT_NAME,
            FACULTY_PULPIT_FACULTYToFACULTY: {
                connectOrCreate: {
                    where: {
                        FACULTY: req.body.FACULTY,
                    },
                    create: {
                        FACULTY: req.body.FACULTY,
                        FACULTY_NAME: req.body.FACULTY_NAME,
                    },
                },
            },
        },
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
async function putPulpit(req, res) {
    if (!(await client.PULPIT.findFirst({
        where: {
            PULPIT: req.body.PULPIT,
        },
    }))
    ) {
        return res.status(400).json({ error: "Object with this primary key doesn't exist" });
    }
    client.PULPIT.update({
        where: {
            PULPIT: req.body.PULPIT,
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
async function deletePulpit(req, res) {
    if (!(await client.PULPIT.findFirst({
        where: {
            PULPIT: decodeURIComponent(req.params.xyz),
        },
    }))
    ) {
        return res.status(400).json({ error: "Object with this primary key doesn't exist" });
    }
    client.PULPIT.delete({
        where: {
            PULPIT: decodeURIComponent(req.params.xyz) },
    })
        .then((result) => {
            res.status(200).json({ result });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Reference to non-existent foreign key" });
        });
}

module.exports = { getAllPulpits, findPulpitsWithoutTeachers, findPulpitsWithVladimir, postPulpit, putPulpit, deletePulpit };