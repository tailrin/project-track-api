const express = require("express");
const logger = require("../middleware/logger.js");
const xss = require("xss");
const ProjectsService = require("./projects-service");

const ProjectsRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

const serializeProject = (project) => ({
  id: project.id,
  project_name: xss(project.project_name),
  description: xss(project.description),
  dateadded: project.dateadded,
  duedate: project.duedate,
  dateclosed: project.dateclosed,
  priority: project.priority,
  status: project.status,
  companyid: project.companyid,
});

// Get all Projects for the company
ProjectsRouter.route("/c/:companyid")
  .all(requireAuth)
  .get((req, res, next) => {
    const { companyid } = req.params;
    ProjectsService.getAllCompanyProjects(req.app.get("db"), companyid)
      .then((projects) => {
        if (!projects) {
          logger.error(`Project with Company id ${companyid} not found.`);
          return res.status(404).json({
            error: { message: `Project not found` },
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
    } = req.body;

    const status = "New";

    const newProject = {
      project_name,
      description,
      dateadded,
      duedate,
      priority,
      status,
      companyid,
    };

    const required = { project_name, dateadded, priority, status };
    for (const [key, value] of Object.entries(required))
      if (value == null || value === "")
        return res.status(400).json({
          error: `Missing '${key}' in request body`,
        });

    if (priority != null) {
      if (
        priority !== "High" &&
        priority !== "Medium" &&
        priority !== "Low" &&
        priority !== "Urgent"
      ) {
        logger.error(`Invalid priority '${priority}' supplied`);

        return res
          .status(400)
          .send(`'Priority' must be: High, Medium, Low, or Urgent`);
      }
    }

    ProjectsService.insertProject(req.app.get("db"), newProject)
      .then((newProject) => {
        res.status(201).location(`/`).json(serializeProject(newProject));
      })
      .catch(next);
  });

ProjectsRouter.route("/:id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params;
    ProjectsService.getById(req.app.get("db"), id)
      .then((project) => {
        if (!project) {
          logger.error(`Project with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Project Not Found` },
          });
        }
        res.json(serializeProject(project));
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { id } = req.params;
    let {
      project_name,
      description,
      duedate,
      priority,
      status,
      dateclosed,
    } = req.body;

    //If the status has been set to closed and the user hasn't chosen a date update it to today
    if (status === "Closed" && dateclosed === undefined) {
      dateclosed = new Date();
    }

    const updatedProject = {
      project_name,
      description,
      duedate,
      dateclosed,
      priority,
      status,
    };

    if (priority != null) {
      if (
        priority !== "High" &&
        priority !== "Medium" &&
        priority !== "Low" &&
        priority !== "Urgent"
      ) {
        logger.error(`Invalid priority '${priority}' supplied`);

        return res
          .status(400)
          .send(`'Priority' must be: High, Medium, Low, or Urgent`);
      }
    }
    if (status != null) {
      if (
        status !== "New" &&
        status !== "In Progress" &&
        status !== "Closed" &&
        status !== "On Hold"
      ) {
        logger.error(`Invalid status '${status}' supplied`);
        return res
          .status(400)
          .send(`'Status' must be: New, In Progress, Closed, or On Hold`);
      }
    }
    ProjectsService.updateProject(req.app.get("db"), id, updatedProject)
      .then((project) => {
        if (!project) {
          logger.error(`Project with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `Project Not Found` },
          });
        }
        res.status(201).location(`/`).end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    ProjectsService.deleteProject(req.app.get("db"), id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch((err) => {
        console.err(err).next();
      });
  });

module.exports = ProjectsRouter;
