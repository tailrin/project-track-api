const express = require("express");
const logger = require("../middleware/logger.js");
const xss = require("xss");
const TasksService = require("./tasks-service");

const TasksRouter = express.Router();
const bodyParser = express.json();
const { requireAuth } = require("../middleware/jwt-auth");

const serializeTask = task => ({
  id: task.id,
  projectid: task.projectid,
  task_name: xss(task.task_name),
  assignedto: task.assignedto,
  description: xss(task.description),
  priority: task.priority,
  status: task.status
});

// Get all Tasks for the company
TasksRouter.route("/c/:companyid")
  .all(requireAuth)
  .get((req, res, next) => {
    const { companyid } = req.params;
    TasksService.getAllCompanyTasks(req.app.get("db"), companyid)
      .then(tasks => {
        if (!tasks) {
          logger.error(`Task with Company id ${companyid} not found.`);
          return res.status(404).json({
            error: { message: `task not found` }
          });
        }
        res.json(tasks.map(serializeTask));
      })
      .catch(next);
  });

// Get all Tasks for the project
TasksRouter.route("/p/:projectid")
  .all(requireAuth)
  .get((req, res, next) => {
    const { projectId } = req.params;
    TasksService.getAllProjectTasks(req.app.get("db"), projectId)
      .then(tasks => {
        if (!tasks) {
          logger.error(`Task with Project id ${projectId} not found.`);
          return res.status(404).json({
            error: { message: `task not found` }
          });
        }
        res.json(tasks.map(serializeTask));
      })
      .catch(next);
  })
  //add a task to a project
  .post(bodyParser, (req, res, next) => {
    const { projectid } = req.params;
    const { task_name, assignedto, description, priority } = req.body;

    let status = "New";
    const newtask = {
      task_name,
      assignedto,
      description,
      priority,
      status,
      projectid
    };

    const required = { task_name, priority };
    for (const [key, value] of Object.entries(required))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    if (
      priority !== "High" &&
      priority !== "Medium" &&
      priority !== "Low" &&
      priority !== "Urgent"
    ) {
      // logger.error(`Invalid priority '${priority}' supplied`);
      console.log("invalid priority");
      return res
        .status(400)
        .send(`'Priority' must be: High, Medium, Low, or Urgent`);
    }
    TasksService.insertTask(req.app.get("db"), newtask)
      .then(newtask => {
        res
          .status(201)
          .location(`/`)
          .json(serializeTask(newtask));
      })
      .catch(next);
  });

TasksRouter.route("/:id")
  .all(requireAuth)
  .get((req, res, next) => {
    const { id } = req.params;
    TasksService.getById(req.app.get("db"), id)
      .then(task => {
        if (!task) {
          logger.error(`task with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `task Not Found` }
          });
        }
        res.json(serializeTask(task));
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { id } = req.params;
    const { task_name, assignedto, description, priority, status } = req.body;

    let datemodified = new Date();
    const updatedtask = {
      task_name,
      assignedto,
      description,
      datemodified,
      priority,
      status
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
    TasksService.updateTask(req.app.get("db"), id, updatedtask)
      .then(task => {
        if (!task) {
          logger.error(`task with id ${id} not found.`);
          return res.status(404).json({
            error: { message: `task Not Found` }
          });
        }
        res
          .status(201)
          .location(`/`)
          .end();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { id } = req.params;

    TasksService.deleteTask(req.app.get("db"), id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(err => {
        console.log(err).next();
      });
  });

module.exports = TasksRouter;
