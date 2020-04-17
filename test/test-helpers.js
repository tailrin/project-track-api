const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeCompaniesArray() { 
    return [
        {
            id: 1,
            company_name:"Demo"
        },
        {
            id: 2,
            company_name:"Thinkful"
        }
    ]
}
function makeUsersArray() {
  return [
    {
      id: 1,
      full_name: "John Smith",
      email: "johnsmith@gmail.com",
      password: "password",
      isadmin: true,
      companyid: 1,
    },
    {
      id: 2,
      full_name: "Jane King",
      email: "janeking@gmail.com",
      password: "password",
      isadmin: false,
      companyid: 2,
    },
    {
      id: 3,
      full_name: "Michael Johnson",
      email: "mj@gmail.com",
      password: "password",
      isadmin: true,
      companyid: 2,
    },
    {
      id: 4,
      full_name: "Ben Shepard",
      email: "bens@gmail.com",
      password: "password",
      isadmin: true,
      companyid: 1,
    },
  ];
}

const makeProjectsArray = (companies) => {
  return [
    {
      id: 1,
      project_name: "Crisis message board",
      description: "Create a site to help users create crisis messages",
      dateadded: new Date("2029-01-22T16:28:32.615Z"),
      duedate: new Date("2029-03-22T16:28:32.615Z"),
      dateclosed: new Date("2029-03-17T16:28:32.615Z"),
      priority: "Medium",
      status: "Closed",
      companyid: companies[0].id,
    },
    {
      id: 2,
      project_name: "Covid Plasma Donation Site",
      description: "Get plasma from survivors of covid",
      dateadded: new Date("2029-03-30T16:28:32.615Z"),
      duedate: new Date("2029-04-22T16:28:32.615Z"),
      dateclosed: new Date("2029-06-12T16:28:32.615Z"),
      priority: "High",
      status: "In Progress",
      companyid: companies[1].id,
    },
    {
      id: 3,
      project_name: "Emergency supply delivery routes",
      description: "Help route to areas which need supplies",
      dateadded: new Date("2029-04-12T16:28:32.615Z"),
      duedate: new Date("2029-05-22T16:28:32.615Z"),
      dateclosed: new Date("2029-05-30T16:28:32.615Z"),
      priority: "Urgent",
      status: "New",
      companyid: companies[1].id,
    },
  ];
};

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: "HS256",
  });

  return `Bearer ${token}`;
}

function makeTasksArray(projects, users) {
  return [
    {
      id: 1,
      projectid: 1,
      task_name: "Create back-end route for adding messages",
      assignedto: 2,
      description: "Make sure post request passing and write tests",
      priority: "High",
      status: "New",
      datecreated: new Date("2029-01-22T16:28:32.615Z"),
      datemodified: new Date("2029-01-26T16:28:32.615Z"),
      dateclosed: new Date("2029-01-27T16:28:32.615Z"),
    },
    {
      id: 2,
      projectid: 2,
      task_name: "Create home page",
      assignedto: 1,
      description:
        "Home page should display testing sites and link to signup form",
      priority: "High",
      status: "In Progress",
      datecreated: new Date("2029-01-22T16:28:32.615Z"),
      datemodified: new Date("2029-02-02T16:28:32.615Z"),
      dateclosed: new Date("2029-02-12T16:28:32.615Z"),
    },
    {
      id: 3,
      projectid: 3,
      task_name: "Write algorithm for best route",
      assignedto: 3,
      description: "use dijkstra's shortest path algorithm",
      priority: "Urgent",
      status: "Closed",
      datecreated: new Date("2029-01-22T16:28:32.615Z"),
      datemodified: new Date("2029-02-02T16:28:32.615Z"),
      dateclosed: new Date("2029-04-02T16:28:32.615Z"),
    },
  ];
}

function makeExpectedTask(task) {
  return {
    id: task.id,
    projectid: task.projectid,
    task_name: task.task_name,
    assignedTo: task.assignedTo,
    description: task.description,
    priority: task.priority,
    status: task.status,
    datecreated: task.datecreated.toISOString(),
    datemodified: task.datemodified.toISOString(),
    dateclosed: task.dateclosed.toISOString(),
  };
}
function makeExpectedUser(user) { 
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    isadmin: user.isadmin
  };
   
}
function makeExpectedProject(project) {
    return {
      id: project.id,
      project_name: project.project_name,
      description: project.description,
      dateadded: project.dateadded.toISOString(),
      duedate: project.duedate.toISOString(),
      dateclosed: project.dateclosed.toISOString(),
      priority: project.priority,
      status: project.status,
      companyid: project.companyid,
    };
     

    
}
function makeExpectedCompany(company) {
  return {
    id: company.id,
    company_name: company.company_name
  }
}



function makeFixtures() {
  const testUsers = makeUsersArray();
  const testCompanies = makeCompaniesArray(testUsers);
  const testProjects = makeProjectsArray(testCompanies);
  const testTasks = makeTasksArray(testProjects, testUsers);
  return { testUsers, testCompanies, testProjects, testTasks };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
          users,
          company,
          projects,
          tasks
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE company_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE projects_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE tasks_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('company_id_seq', 0)`),
          trx.raw(`SELECT setval('projects_id_seq', 0)`),
          trx.raw(`SELECT setval('tasks_id_seq', 0)`),
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into("users")
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
    );
}

function seedCompanies(db, companies) { 
  return db 
    .into("company")
    .insert(companies)
    .then(() => { 
      db.raw(`SELECT setval('company_id_seq', ?)`, [companies[companies.length - 1].id]);
    })
}
function seedProjectsTables(db, users, projects, companies, tasks) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedCompanies(trx, companies);
    await seedUsers(trx, users);
    await trx.into("projects").insert(projects);

    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('projects_id_seq', ?)`, [
      projects[projects.length - 1].id,
    ]);
    // only insert tasks if there are some, also update the sequence counter
    if (tasks.length) {
      await trx.into("tasks").insert(tasks);
      await trx.raw(`SELECT setval('tasks_id_seq', ?)`, [
        tasks[tasks.length - 1].id,
      ]);
    }
  });
}
 
function makeMaliciousProject(user) {
  const maliciousProject = {
    id: 911,
    companyid: 2,
    project_name:"BAD PROJECT",
    dateadded: new Date(),
    duedate: new Date(),
    dateclosed:null,
    priority: 'High',
    description: 'Naughty naughty very naughty <script>alert("xss");</script>',
    status:'Closed'
  };
  const expectedProject = {
    ...makeExpectedProject([user], maliciousProject),
    description:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
  };
  return {
    maliciousProject,
    expectedProject,
  };
}

function seedMaliciousProject(db, user, project) {
  return db
    .into("users")
    .insert([user])
    .then(() => db.into("projects").insert([project]));
}

module.exports = {
  makeUsersArray,
  makeProjectsArray,
  makeCompaniesArray,
  makeTasksArray,
  makeExpectedProject,
  makeExpectedTask,
  makeExpectedCompany,
  makeExpectedUser,
  makeAuthHeader,
  makeMaliciousProject,
  seedMaliciousProject,
  makeFixtures,
  cleanTables,
  seedProjectsTables,
  seedUsers,
  seedCompanies
};
