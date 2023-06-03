const {PrismaClient} = require("@prisma/client");
const client = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

// --------------------------------- GET ---------------------------------
async function getAllAuditoriumTypes(req, res) {
    await client.AUDITORIUM_TYPE.findMany()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(404).json({error: "Auditoriums types are not found"});
        });
}

async function findAuditoriumsByAuditoriumType(req, res) {
    const result = await client.AUDITORIUM_TYPE.findFirst({
        where: { AUDITORIUM_TYPE: decodeURIComponent(req.params.xyz) },
        select: {
            AUDITORIUM_TYPE: true,
            AUDITORIUM_AUDITORIUM_AUDITORIUM_TYPEToAUDITORIUM_TYPE: {
                select: {
                    AUDITORIUM: true,
                },
            },
            AUDITORIUM_TYPE: true,
        },
    });
    if (!result) {
        return res.status(404).json({ error: "This auditorium type is not found" });
    } else res.send(result);
}


// --------------------------------- POST ---------------------------------
async function postAuditoriumType(req, res) {
    if (await client.AUDITORIUM_TYPE.findFirst({
        where: {
            AUDITORIUM_TYPE: req.body.AUDITORIUM_TYPE,
        },
    })
    ) {
        return res.status(400).json({ error: "Object with this primary key already exists" });
    }
    client.AUDITORIUM_TYPE.create({
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
async function putAuditoriumType(req, res) {
    if (!(await client.AUDITORIUM_TYPE.findFirst({
        where: {
            AUDITORIUM_TYPE: req.body.AUDITORIUM_TYPE,
        },
    }))
    ) {
        return res.status(400).json({ error: "Object with this primary key doesn't exist" });
    }
    client.AUDITORIUM_TYPE.update({
        where: {
            AUDITORIUM_TYPE: req.body.AUDITORIUM_TYPE,
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
async function deleteAuditoriumType(req, res) {
    if (!(await client.AUDITORIUM_TYPE.findFirst({
        where: {
            AUDITORIUM_TYPE: decodeURIComponent(req.params.xyz),
        },
    }))
    ) {
        return res.status(400).json({ error: "Object with this primary key doesn't exist" });
    }
    client.AUDITORIUM_TYPE.delete({
        where: {
            AUDITORIUM_TYPE: decodeURIComponent(req.params.xyz) },
    })
        .then((result) => {
            res.status(200).json({ result });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Reference to non-existent foreign key" });
        });
}

module.exports = { getAllAuditoriumTypes, findAuditoriumsByAuditoriumType, postAuditoriumType, putAuditoriumType, deleteAuditoriumType };