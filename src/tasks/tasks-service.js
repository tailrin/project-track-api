const TasksService = {
  getAllProjectTasks(db, id) {
    return db
      .from("tasks AS t")
      .select(
        "t.id",
        "t.projectid",
        "t.task_name",
        "t.assignedto",
        "t.description",
        "t.priority",
        "t.status",
        "t.datecreated",
        "t.datemodified",
        ...projectFields
      )
      .leftJoin("projects AS p", "t.projectid", "p.id")
      .where("p.id", id);
  },
  getById(db, id) {
    return db
      .from("tasks")
      .select("*")
      .where("id", id)
      .first();
  },
  insertTask(db, newTask) {
    return db
      .insert(newTask)
      .into("tasks")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteTask(db, id) {
    return db("tasks")
      .where({ id })
      .delete();
  },
  updateTask(db, id, newTaskFields) {
    return db("tasks")
      .where({ id })
      .update(newTaskFields);
  }
};

const projectFields = [
  "p.id AS project:id",
  "p.project_name AS project:project_name",
  "p.description AS project:descripotion",
  "p.dateadded AS project:dateadded",
  "p.duedate AS project:duedate",
  "p.priority AS project:priority",
  "p.status AS project:status",
  "p.companyid AS project:companyid"
];

const userFields = [
  "usr.id AS user:id",
  "usr.user_name AS user:user_name",
  "usr.full_name AS user:full_name"
];
module.exports = TasksService;
