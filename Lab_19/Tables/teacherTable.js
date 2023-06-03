const {PrismaClient} = require("@prisma/client");
const client = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

// --------------------------------- GET ---------------------------------
async function getAllTeachers(req, res) {
    await client.TEACHER.findMany()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            res.status(404).json({ error: "Teachers are not found" });
        });
}

async function fluent(req, res) {
    const result=await client.PULPIT.findUnique({
        where: {
            PULPIT: "ИСиТ",
        }
    })
        .TEACHER_TEACHER_PULPITToPULPIT();
    if (!result) {
        return res.status(404).json({ error: "This faculty is not found" });
    } else res.send(result);
}


// --------------------------------- POST ---------------------------------
async function postTeacher(req, res) {
    if (await client.TEACHER.findFirst({
        where: {
            TEACHER: req.body.TEACHER,
        },
    })
    ) {
        return res.status(400).json({ error: "Object with this primary key already exists" });
    }
    client.TEACHER.create({
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
async function putTeacher(req, res) {
    if (!(await client.TEACHER.findFirst({
        where: {
            TEACHER: req.body.TEACHER,
        },
    }))
    ) {
        return res.status(400).json({ error: "Object with this primary key doesn't exist" });
    }
    client.TEACHER.update({
        where: {
            TEACHER: req.body.TEACHER,
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
async function deleteTeacher(req, res) {
    if (!(await client.TEACHER.findFirst({
        where: {
            TEACHER: decodeURIComponent(req.params.xyz),
        },
    }))
    ) {
        return res.status(400).json({ error: "Object with this primary key doesn't exist" });
    }
    client.TEACHER.delete({
        where: {
            TEACHER: decodeURIComponent(req.params.xyz) },
    })
        .then((result) => {
            res.status(200).json({ result });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ error: "Reference to non-existent foreign key" });
        });
}

module.exports = { getAllTeachers, fluent, postTeacher, putTeacher, deleteTeacher };