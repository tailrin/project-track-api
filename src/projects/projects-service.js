const ProjectsService = {
  getAllCompanyProjects(db, id) {
    return db
      .from("projects AS p")
      .select(
        "p.id",
        "p.project_name",
        "p.description",
        "p.dateadded",
        "p.duedate",
        "p.priority",
        "p.status",
        "p.companyid",
        "p.dateclosed",
        ...companyFields
      )
      .leftJoin("company AS c", "p.companyid", "c.id")
      .where("c.id", id);
  },
  getById(db, id) {
    return db.from("projects").select("*").where("id", id).first();
  },
  insertProject(db, newProject) {
    return db
      .insert(newProject)
      .into("projects")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  deleteProject(db, id) {
    return db("projects").where({ id }).delete();
  },
  updateProject(db, id, newProjectFields) {
    return db("projects").where({ id }).update(newProjectFields);
  },
};

const companyFields = [
  "c.id AS company:id",
  "c.company_name AS company:company_name",
];

const userFields = [
  "usr.id AS user:id",
  "usr.user_name AS user:user_name",
  "usr.full_name AS user:full_name",
];
module.exports = ProjectsService;
