const express = require("express");
const logger = require("../middleware/logger.js");
const xss = require("xss");
const ProjectsService = require("./Projects-service");

const ProjectsRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

const serializeProject = project => ({
  id: project.id,
  project_name: xss(project.project_name),
  description: xss(project.description),
  dateadded: project.dateadded,
  duedate: project.duedate,
  priority: project.priority,
  status: project.status,
  companyid: project.companyid
});

// Get all Projects for the company
ProjectsRouter.route("/c/:companyId")
  .all(requireAuth)
  .get((req, res, next) => {
    const { companyId } = req.params;
    ProjectsService.getAllCompanyProjects(req.app.get("db"), companyId)
      .then(projects => {
        if (!projects) {
          logger.error(`Project with Company id ${companyId} not found.`);
          return res.status(404).json({
            error: { message: `Project not found` }
          });
        }
        res.json(projects.map(serializeProject));
      })
      .catch(next);
  })
  //add a project to a company
  .post(bodyParser, (req, res, next) => {
    const { companyid } = req.params;
    const {
      project_name,
      description,
      dateadded,
      duedate,
      priority,
      status
    } = req.body;
    const newProject = {
      project_name,
      description,
      dateadded,
      duedate,
      priority,
      status,
      companyid
    };

    const required = { project_name, dateadded, priority, status };
    for (const [key, value] of Object.entries(required))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    ProjectsService.insertProject(req.app.get("db"), newProject)
      .then(newProject => {
        res
          .status(201)
          .location(`/`)
          .json(serializeProject(newProject));
      })
      .catch(next);
  });

ProjectsRouter.route("/:id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params;
    ProjectsService.getById(req.app.get("db"), id)
      .then(project => {
        if (!project) {
          logger.error(`Project with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Project Not Found` }
          });
        }
        res.json(serializeProject(project));
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { id } = req.params;
    const { project_name, description, duedate, priority, status } = req.body;
    const updatedProject = {
      project_name,
      description,
      duedate,
      priority,
      status
    };
    ProjectsService.updateProject(req.app.get("db"), id, updatedProject)
      .then(newProject => {
        res
          .status(201)
          .location(`/`)
          .end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    ProjectsService.deleteProject(req.app.get("db"), id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(err => {
        console.log(err).next();
      });
  });

module.exports = ProjectsRouter;
