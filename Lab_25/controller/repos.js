const Error = require("../Error");
const access = require("../security/defines").access;
const admin = require("../security/defines").admin;
const entity = require("../security/defines").entity;
const { PrismaClient } = require("@prisma/client");
const { subject } = require("@casl/ability");
const prismaClient = new PrismaClient();

exports.repos = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        if (req.ability.can(access.read, entity.repos)) {
          let repos = await prismaClient.repos.findMany({
            select: {
              id: true,
              name: true,
              authorId: true,
            },
          });
          res.status(200).json(repos);
        } else return Error.Error403(res);
      } catch (err) {
        return Error.Error500(res, err);
      }
      break;
    case "POST":
      try {
        if (req.ability.can(access.create, entity.repos)) {
          let repos = await prismaClient.repos.create({
            data: {
              name: req.body.name,
              authorId: parseInt(req.payload.id),
            },
          });
          res.status(200).json(repos);
        } else return Error.Error403(res);
      } catch (err) {
        return Error.Error500(res, err);
      }
      break;
    default:
      return Error.Error405(res);
  }
};

exports.reposById = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        if (req.ability.can(access.read, entity.repos)) {
          let repos = await prismaClient.repos.findUnique({
            where: { id: parseInt(req.params.id) },
          });
          res.status(200).json(repos);
        } else return Error.Error403(res);
      } catch (err) {
        return Error.Error500(res, err);
      }
      break;
    case "PUT":
      try {
        const repoId = Number(req.params.id);
        const repo = await prismaClient.repos.findFirst({
          where: {
            id: repoId,
          },
        });
        if (!repo) {
          return Error.Error404(res);
        }
        if (
          !req.ability.can(
            access.update,
            subject(entity.repos, { authorId: repo.authorId })
          )
        ) {
          return Error.Error403(res);
        }
        const updatedRepo = await prismaClient.repos.update({
          where: {
            id: repo.id,
          },
          data: {
            name: req.body.name,
          },
        });
        res.status(200).json(updatedRepo);
      } catch (err) {
        return Error.Error500(res, err);
      }
      break;
    case "DELETE":
      try {
        if (req.ability.can(access.delete, entity.repos)) {
          let repos = await prismaClient.repos.delete({
            where: { id: parseInt(req.params.id) },
          });
          res.status(200).json(repos);
        } else return Error.Error403(res);
      } catch (err) {
        return Error.Error500(res, err);
      }
      break;
    default:
      return Error.Error405(res);
  }
};
