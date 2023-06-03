const { PrismaClient } = require("@prisma/client");
const prismaClient = new PrismaClient();
const Error = require("../Error");
const { repos } = require("./repos");
const { subject } = require("@casl/ability");
const access = require("../security/defines").access;
const admin = require("../security/defines").admin;
const entity = require("../security/defines").entity;

exports.commits = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        if (req.ability.can(access.read, entity.commits)) {
          prismaClient.commits
            .findMany({
              where: {
                repoId: parseInt(req.params.id),
              },
            })
            .then((result) => {
              res.status(200).json(result);
            });
        } else {
          return Error.Error403(res);
        }
      } catch (err) {
        return Error.Error500(res, err);
      }
      break;
    case "POST":
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
            access.create,
            subject(entity.commits, { authorId: repo.authorId })
          )
        ) {
          return Error.Error403(res);
        }
        const createdCommit = await prismaClient.commits.create({
          data: {
            message: req.body.message,
            repos: {
              connect: {
                id: repo.id,
              },
            },
          },
        });
        res.status(200).json(createdCommit);
      } catch (err) {
        return Error.Error500(res, err);
      }
      break;
    default:
      return Error.Error405(res);
  }
};

exports.commitsById = async (req, res) => {
  switch (req.method) {
    case "GET":
      try {
        if (req.ability.can(access.read, entity.commits)) {
          prismaClient.commits
            .findUnique({
              where: {
                id: Number.parseInt(req.params.commitId),
              },
            })
            .then((result) => {
              res.status(200).json(result);
            });
        } else {
          return Error.Error403(res);
        }
      } catch (err) {
        return Error.Error500(res, err);
      }
      break;
    case "PUT":
      try {
        if (req.ability.can(access.read, entity.repos)) {
          let repos = await prismaClient.repos.findUnique({
            where: {
              id: parseInt(req.params.id),
            },
          });
          const commit = await prismaClient.commits.findFirst({
            where: {
              AND: [
                {
                  id: parseInt(req.params.commitId),
                },
                {
                  repos: {
                    id: parseInt(req.params.id),
                  },
                },
              ],
            },
          });
          if (!commit) {
            return Error.Error404(res);
          }
          if (
            !req.ability.can(
              access.update,
              subject(entity.commits, {
                authorId: repos.authorId,
              })
            )
          ) {
            return Error.Error403(res);
          }
          let commitUpdate = await prismaClient.commits.update({
            where: {
              id: parseInt(req.params.commitId),
            },
            data: {
              message: req.body.message,
            },
          });
          res.status(200).json(commitUpdate);
        } else {
          return Error.Error403(res);
        }
      } catch (err) {
        console.log(err);
        return Error.Error500(res, err);
      }
      break;
    case "DELETE":
      try {
        if (req.ability.can(access.read, entity.repos)) {
          let repos = await prismaClient.repos.findFirst({
            where: {
              id: parseInt(req.params.id),
            },
          });
          const commit = await prismaClient.commits.findFirst({
            where: {
              AND: [
                {
                  id: parseInt(req.params.commitId),
                },
                {
                  repos: {
                    id: parseInt(req.params.id),
                  },
                },
              ],
            },
          });
          if (!commit) {
            return Error.Error404(res);
          }
          if (
            !req.ability.can(
              access.delete,
              subject(entity.commits, {
                authorId: repos.authorId,
              })
            )
          ) {
            return Error.Error403(res);
          }
          let commitDelete = await prismaClient.commits.delete({
            where: {
              id: parseInt(req.params.commitId),
            },
          });
          res.status(200).json(commitDelete);
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
