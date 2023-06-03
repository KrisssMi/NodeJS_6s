const {PrismaClient} = require("@prisma/client");
const client = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

// --------------------------------- GET ---------------------------------
async function getAllAuditoriums(req, res) {
  await client.AUDITORIUM.findMany()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(404).json({ error: "Auditoriums are not found" });
    });
}

async function findAuditoriumsWithComp1(req, res) {
    const result = await client.AUDITORIUM.findMany({
        where: {
            AUDITORIUM_TYPE: "ЛБ-К",
            AUDITORIUM: {
                contains: "-1",
            },
        },
    });
    if (!result) {
        return res.status(404).json({ error: "This auditoriums are not found" });
    } else res.send(result);
}

async function findAuditoriumsSameCount(req, res) {
    const result = await client.AUDITORIUM.groupBy({
        by: ["AUDITORIUM_TYPE", "AUDITORIUM_CAPACITY"],
        _count: {
            _all: true,
        },
    });
    if (!result) {
        return res.status(404).json({ error: "This auditoriums are not found" });
    } else res.send(result);
}

async function transaction(req, res) {
    try {
        await client.$transaction(async (transaction) => {
            await transaction.AUDITORIUM.updateMany({
                where: {},
                data: {
                    AUDITORIUM_CAPACITY: {
                        increment: 100,
                    },
                },
            });
            throw new Error("Error");
        });
    } catch (error) {
        console.log(error);
        res.status(200).json(await client.AUDITORIUM.findMany());
    }
}


// --------------------------------- POST ---------------------------------
async function postAuditorium(req, res) {
    if (await client.AUDITORIUM.findFirst({
        where: {
            AUDITORIUM: req.body.AUDITORIUM,
        },
    })
    ) {
        return res.status(400).json({ error: "Object with this primary key already exists" });
    }
    client.AUDITORIUM.create({
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
async function putAuditorium(req, res) {
    if (!(await client.AUDITORIUM.findFirst({
        where: {
            AUDITORIUM: req.body.AUDITORIUM,
        },
    }))
    ) {
        return res.status(400).json({ error: "Object with this primary key doesn't exist" });
    }
    client.AUDITORIUM.update({
        where: {
            AUDITORIUM: req.body.AUDITORIUM,
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
async function deleteAuditorium(req, res) {
    if (!(await client.AUDITORIUM.findFirst({
        where: {
            AUDITORIUM: decodeURIComponent(req.params.xyz),
        },
    }))
    ) {
        return res.status(400).json({ error: "Object with this primary key doesn't exist" });
    }
    client.AUDITORIUM.delete({
        where: {
            AUDITORIUM: decodeURIComponent(req.params.xyz) },
    })
        .then((result) => {
            res.status(200).json({ result });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Reference to non-existent foreign key" });
        });
}

module.exports = { getAllAuditoriums, findAuditoriumsWithComp1, findAuditoriumsSameCount, transaction, postAuditorium, putAuditorium, deleteAuditorium };