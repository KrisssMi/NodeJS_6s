const path = __dirname.split("\\");
const Error = require("../Error");
const access = require("../security/defines").access;
const admin = require("../security/defines").admin;
path.pop(); // remove "controller" from path (path to "controller" folder)
const { PrismaClient } = require("@prisma/client");
const { User } = require("../security/roles");
const { entity } = require("../security/defines");
const { subject } = require("@casl/ability");
const prismaClient = new PrismaClient();

exports.listUsers = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        if (req.ability.can(admin.manage, admin.all)) {
          let users = await prismaClient.users.findMany({
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
            },
          });
          res.status(200).json(users);
        } else return Error.Error403(res);
      } catch (err) {
        return Error.Error500(res, err);
      }
      break;
    default:
      Error.Error405(res);
  }
};

exports.infoByUserId = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        if (
          req.ability.can(
            access.read,
            subject(entity.users, { id: parseInt(req.params.id) })
          )
        ) {
          let user = await prismaClient.users.findUnique({
            where: {
              id: parseInt(req.params.id),
            },
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
            },
          });
          res.status(200).json(user);
        } else {
          return Error.Error403(res);
        }
      } catch (err) {
        return Error.Error500(res, err);
      }
      break;
    default:
      return Error.Error405(res);
  }
};
