const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function getAllDep(req, res) {
  try {
    const department = await client.department.findMany({
      select: {
        idDep: true,
        department: true,
        leader: true,
        phoneNum: true,
      },
    });
    res.render("E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\department.hbs", {
      department,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
}

async function getDepartmentByBodyId(req, res, next) {
  try {
    const idDep = Number(req.body.idDep);
    if (isNaN(idDep)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const dep = await client.department.findFirst({
      where: {
        idDep: idDep,
      },
    });

    if (!dep) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.render("department-by-id", {
      ...dep,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
}

async function getDepartmentById(req, res, next) {
  try {
    const idDep = Number(req.params.idDep);
    if (isNaN(idDep)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const dep = await client.department.findFirst({
      where: {
        idDep: idDep,
      },
    });

    res.render("department-by-id", {
      ...dep,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
}

async function getAddPageDep(req, res) {
  try {
    res.render(
      "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\department-add.hbs"
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function getUpdatePage(req, res) {
  try {
    res.render(
      "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\department-update.hbs"
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function addDepartment(req, res) {
  try {
    const dep = await client.department.create({
      data: {
        ...req.body,
      },
    });
    res.render(
      "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\department-add.hbs",
      { dep }
    );
    res.redirect("/department/all");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function updateDepartment(req, res) {
  console.log("test2");
  try {
    const dep = await client.department.update({
      where: {
        idDep: Number(req.params.idDep),
      },
      data: {
        ...req.body,
      },
    });
    console.log(dep.idDep);
    res.render(
      "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\department-update.hbs",
      { dep }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function deleteDepartment(req, res) {
  try {
    const idDep = Number(req.params.idDep);
    console.log(req.params.idDep);
    if (!Number.isInteger(idDep)) {
      console.log("Invalid ID");
    }

    const deletedDepartment = await client.department.delete({
      where: {
        idDep: idDep,
      },
    });
    console.log(req.params.id);
    res.redirect("/department/all");
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

module.exports = {
  getAllDep,
  getDepartmentByBodyId,
  getDepartmentById,
  getAddPageDep,
  getUpdatePage,
  addDepartment,
  updateDepartment,
  deleteDepartment,
};
