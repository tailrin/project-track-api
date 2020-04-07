const TasksService = {
  getAllCompanyTasks(db, id) {
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
        ...projectFields,
        ...companyFields
      )
      .leftJoin("projects AS p", "t.projectid", "p.id")
      .innerJoin("company AS c", "p.companyid", "c.id")
      .where("c.id", id);
  },
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
  "p.id AS projects:id",
  "p.project_name AS projects:project_name",
  "p.description AS projects:description",
  "p.dateadded AS projects:dateadded",
  "p.duedate AS projects:duedate",
  "p.priority AS projects:priority",
  "p.status AS projects:status",
  "p.companyid AS projects:companyid"
];
const companyFields = [
  "c.id AS company:id",
  "c.company_name AS company:company_name"
];

const userFields = [
  "usr.id AS user:id",
  "usr.user_name AS user:user_name",
  "usr.full_name AS user:full_name"
];
module.exports = TasksService;
