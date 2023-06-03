require("dotenv").config({ path: "../.env" });
const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
const express = require("express");
const bodyParser = require("body-parser");
const facultyHandler = require("./Tables/facultyTable");
const pulpitHandler = require("./Tables/pulpitTable");
const teacherHandler = require("./Tables/teacherTable");
const subjectHandler = require("./Tables/subjectTable");
const auditoriumTypeHandler = require("./Tables/auditoriumtypesTable");
const auditoriumHandler = require("./Tables/auditoriumTable");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(3000, () => {
  console.log(`Server started on port 3000`);
});

// --------------------------- GET -------------------------------------

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.get("/api/faculties", facultyHandler.getAllFaculties);
app.get("/api/pulpits", pulpitHandler.getAllPulpits);
app.get("/api/teachers", teacherHandler.getAllTeachers);
app.get("/api/subjects", subjectHandler.getAllSubjects);
app.get("/api/auditoriumstypes", auditoriumTypeHandler.getAllAuditoriumTypes);
app.get("/api/auditoriums", auditoriumHandler.getAllAuditoriums);
app.get("/api/auditoriumtypes/:xyz/auditoriums", auditoriumTypeHandler.findAuditoriumsByAuditoriumType);
app.get("/api/faculties/:xyz/subjects", facultyHandler.findSubjectsByFaculty);
app.get("/api/auditoriumsWithComp1", auditoriumHandler.findAuditoriumsWithComp1);
app.get("/api/puplitsWithoutTeachers", pulpitHandler.findPulpitsWithoutTeachers);
app.get("/api/pulpitsWithVladimir", pulpitHandler.findPulpitsWithVladimir);
app.get("/api/auditoriumsSameCount", auditoriumHandler.findAuditoriumsSameCount);
app.get("/api/transaction", auditoriumHandler.transaction);
app.get("/api/fluent", teacherHandler.fluent);

app.get("/api/pagination/:num", async (req, res) => {
  const data = await client.PULPIT.findMany({
    skip: (req.params.num - 1) * 10,
    take: 10,
    include: {
      _count: {
        select: {
          TEACHER_TEACHER_PULPITToPULPIT: true,
        },
      },
    },
  });
  if (!data) {
    return res.status(404).json({
      message: "Data not found",
    });
  }
  res.send(data);
});

// ------------------------------- POST -------------------------------------

app.post("/api/faculties", facultyHandler.postFaculty);
app.post("/api/pulpits", pulpitHandler.postPulpit);
app.post("/api/teachers", teacherHandler.postTeacher);
app.post("/api/subjects", subjectHandler.postSubject);
app.post("/api/auditoriumstypes", auditoriumTypeHandler.postAuditoriumType);
app.post("/api/auditoriums", auditoriumHandler.postAuditorium);

// ------------------------------- PUT -------------------------------------

app.put("/api/faculties", facultyHandler.putFaculty);
app.put("/api/pulpits", pulpitHandler.putPulpit);
app.put("/api/teachers", teacherHandler.putTeacher);
app.put("/api/subjects", subjectHandler.putSubject);
app.put("/api/auditoriumstypes", auditoriumTypeHandler.putAuditoriumType);
app.put("/api/auditoriums", auditoriumHandler.putAuditorium);

// ------------------------------- DELETE -------------------------------------

app.delete("/api/faculties/:xyz", facultyHandler.deleteFaculty);
app.delete("/api/pulpits/:xyz", pulpitHandler.deletePulpit);
app.delete("/api/teachers/:xyz", teacherHandler.deleteTeacher);
app.delete("/api/subjects/:xyz", subjectHandler.deleteSubject);
app.delete("/api/auditoriumstypes/:xyz", auditoriumTypeHandler.deleteAuditoriumType);
app.delete("/api/auditoriums/:xyz", auditoriumHandler.deleteAuditorium);