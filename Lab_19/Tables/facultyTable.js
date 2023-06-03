const {PrismaClient} = require("@prisma/client");
const client = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

// --------------------------------- GET ---------------------------------
async function getAllFaculties(req, res) {
    await client.FACULTY.findMany()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(404).json({error: "Faculties are not found"});
        });
}

async function findSubjectsByFaculty(req, res) {
    const result = await client.FACULTY.findMany({
        where: {
            FACULTY: decodeURIComponent(req.params.xyz),
        },
        select: {
            FACULTY: true,
            PULPIT_PULPIT_FACULTYToFACULTY: {
                select: {
                    PULPIT: true,
                    SUBJECT_SUBJECT_PULPITToPULPIT: {
                        select: {
                            SUBJECT_NAME: true,
                        },
                    },
                },
            },
        },
    });
    if (!result) {
        return res.status(404).json({ error: "This faculty is not found" });
    } else res.send(result);
}


// --------------------------------- POST ---------------------------------
async function postFaculty(req, res) {
    if (await client.FACULTY.findFirst({
        where: {
            FACULTY: req.body.FACULTY,
        },
    })
    ) {
        return res.status(400).json({error: "Object with this primary key already exists"});
    }
    client.FACULTY.create({
        data: {
            FACULTY: req.body.FACULTY,
            FACULTY_NAME: req.body.FACULTY_NAME,
            PULPIT_PULPIT_FACULTYToFACULTY: {
                create: req.body.PULPITS,
            },
        },
    })
        .then((result) => {
            res.status(201).json({result});
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({error: "Reference to non-existent foreign key or reference to already exists key"});
        });
}


// --------------------------------- PUT ---------------------------------
async function putFaculty(req, res) {
    if (!(await client.FACULTY.findFirst({
        where: {
            FACULTY: req.body.FACULTY,
        },
    }))
    ) {
        return res.status(400).json({ error: "Object with this primary key doesn't exist" });
    }
    client.FACULTY.update({
        where: {
            FACULTY: req.body.FACULTY,
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
async function deleteFaculty(req, res) {
    if (!(await client.FACULTY.findFirst({
        where: {
            FACULTY: decodeURIComponent(req.params.xyz),
        },
    }))
    ) {
        return res.status(400).json({ error: "Object with this primary key doesn't exist" });
    }
    client.FACULTY.delete({
        where: {
            FACULTY: decodeURIComponent(req.params.xyz) },
    })
        .then((result) => {
            res.status(200).json({ result });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Reference to non-existent foreign key" });
        });
}

module.exports = { getAllFaculties, findSubjectsByFaculty, postFaculty, putFaculty, deleteFaculty };