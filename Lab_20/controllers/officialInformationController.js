const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function getAllInformation(req, res) {
  try {
    const officialInfo = await client.official_information.findMany();
    res.render(
      "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\official-info.hbs",
      { officialInfo }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function getInformationByBodyId(req, res, next) {
  try {
    const idEmployee = Number(req.body.idEmployee);
    if (isNaN(idEmployee)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const info = await client.official_information.findFirst({
      where: {
        idEmployee: idEmployee,
      },
    });

    if (!info) {
      return res.status(404).json({ message: "Information not found" });
    }

    res.render("official-info-by-id", {
      ...info,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
}

async function getInformationById(req, res, next) {
  try {
    const id = Number(req.params.idEmployee);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid official number" });
    }
    const info = await client.official_information.findFirst({
      where: {
        idEmployee: id,
      },
    });

    res.render("official-info-by-id", { 
        ...info
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
}

async function getAddPage(req, res) {
  try {
    res.render(
      "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\official-info-add.hbs"
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function getUpdatePage(req, res) {
  try {
    res.render(
      "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\official-info-update.hbs"
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function addInformation(req, res) {
  try {
    const info = await client.official_information.create({
      data: {
        personalNum: parseInt(req.body.personalNum),
        surname: req.body.surname,
        name: req.body.name,
        patronymic: req.body.patronymic,
        idDep: parseInt(req.body.idDep),
        education: req.body.education,
        experience: req.body.experience,
        phoneNum: req.body.phoneNum,
        salary: parseInt(req.body.salary),
        status: req.body.status,
      },
    });
    res.render(
      "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\official-info-add.hbs",
      { info }
    );
    res.redirect("/officialInformation/all");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function updateInformation(req, res) {
  try {
    const info = await client.official_information.update({
      where: {
        idEmployee: Number(req.params.idEmployee),
      },
      data: {
        personalNum: parseInt(req.body.personalNum),
        surname: req.body.surname,
        name: req.body.name,
        patronymic: req.body.patronymic,
        idDep: parseInt(req.body.idDep),
        education: req.body.education,
        experience: req.body.experience,
        phoneNum: req.body.phoneNum,
        salary: parseInt(req.body.salary),
        status: req.body.status,
      },
    });
    res.render(
      "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\official-info-update.hbs",
      { info }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function deleteInformation(req, res) {
  try {
    const idEmployee = Number(req.params.idEmployee);
    console.log(req.params.idEmployee);
    if (!Number.isInteger(idEmployee)) {
      console.log("Invalid ID");
    }

    const info = await client.official_information.delete({
      where: {
        idEmployee: idEmployee,
      },
    });
    console.log(req.params.idEmployee);
    res.redirect("/officialInformation/all");
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

module.exports = {
  getAllInformation,
  getInformationByBodyId,
  getInformationById,
  getAddPage,
  getUpdatePage,
  addInformation,
  updateInformation,
  deleteInformation,
};
