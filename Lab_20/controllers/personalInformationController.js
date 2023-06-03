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
    const personalInfo = await client.personal_information.findMany();
    res.render(
      "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\personal-info.hbs",
      { personalInfo }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function getInformationByBodyId(req, res, next) {
  try {
    const personalNum = Number(req.body.personalNum);
    if (isNaN(personalNum)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const info = await client.personal_information.findFirst({
      where: {
        personalNum: personalNum,
      },
    });

    if (!info) {
      return res.status(404).json({ message: "Information not found" });
    }

    res.render("personal-info-by-id", {
      ...info
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
}

async function getInformationById(req, res, next) {
  try {
    const id = Number(req.params.personalNum);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid personal number" });
    }
    const info = await client.personal_information.findFirst({
      where: {
        personalNum: id,
      },
    });

    res.render("personal-info-by-id", {
      ...info,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
}

async function getAddPage(req, res) {
  try {
    res.render(
      "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\personal-info-add.hbs"
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function getUpdatePage(req, res) {
  try {
    res.render(
      "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\personal-info-update.hbs"
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function addInformation(req, res) {
  try {
    if (
      await client.personal_information.findFirst({
        where: {
          personalNum: parseInt(req.body.personalNum),
        },
      })
    ) {
      return res
        .status(400)
        .json({ error: "Object with this primary key already exists" });
    } else {
      const info = await client.personal_information.create({
        data: {
          personalNum: parseInt(req.body.personalNum),
          placeBirth: req.body.placeBirth,
          passport: req.body.passport,
          address: req.body.address,
          regAddress: req.body.regAddress,
          maritalStat: req.body.maritalStat,
          children: parseInt(req.body.children),
          dateBirth: req.body.dateBirth,
        },
      });
      res.render(
        "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\personal-info-add.hbs",
        { info }
      );
      res.redirect("/personalInformation/all");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function updateInformation(req, res) {
  console.log("testPersonal");
  try {
    const info = await client.personal_information.update({
      where: {
        personalNum: Number(req.params.personalNum),
      },
      data: {
        placeBirth: req.body.placeBirth,
        passport: req.body.passport,
        address: req.body.address,
        regAddress: req.body.regAddress,
        maritalStat: req.body.maritalStat,
        children: parseInt(req.body.children),
        dateBirth: req.body.dateBirth,
      },
    });
    console.log(info.personalNum);
    res.render(
      "E:\\BSTU\\3_course\\NodeJS_2s\\Labs\\views\\personal-info-update.hbs",
      { info }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
}

async function deleteInformation(req, res) {
  try {
    const personalNum = Number(req.params.personalNum);
    console.log(req.params.personalNum);
    if (!Number.isInteger(personalNum)) {
      console.log("Invalid ID");
    }

    const info = await client.personal_information.delete({
      where: {
        personalNum: personalNum,
      },
    });
    console.log(req.params.personalNum);
    res.redirect("/personalInformation/all");
  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
}

module.exports = {
  getAllInformation,
  getInformationByBodyId,
  getAddPage,
  getUpdatePage,
  getInformationById,
  addInformation,
  updateInformation,
  deleteInformation,
};
