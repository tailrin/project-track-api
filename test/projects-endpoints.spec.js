const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Projects Endpoints", function () {
    let db;

    const { testUsers, testCompanies, testProjects, testTasks } = helpers.makeFixtures();

    before("make knex instance", () => {
        db = knex({
            client: "pg",
            connection: process.env.TEST_DATABASE_URL
        });
        app.set("db", db);
    });

    after("disconnect from db", () => db.destroy());

    before("cleanup", () => helpers.cleanTables(db));

    afterEach("cleanup", () => helpers.cleanTables(db));

    
    describe(`GET /api/projects/c/company_id`, () => {
        context(`Given no projects`, () => {
             beforeEach("insert companies", () =>
               helpers.seedCompanies(db, testCompanies)
             );
             beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
            it(`responds with 200 and an empty list`, () => {
                const companyId = testCompanies[0].id;
               
                return supertest(app)
                    .get(`/api/projects/c/${companyId}`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    
                    .expect(200, []);
            });
            
     
        });

        context("Given there are projects in the database", () => {
            beforeEach("insert projects", () =>
                helpers.seedProjectsTables(db, testUsers, testProjects, testCompanies, testTasks)
            );

            it("responds with 200 and all of the jobs for a company", () => {
                const companyId = testCompanies[0].id;
                const expectedProjects = testProjects.filter(project => project.companyid === companyId)
                const expectedResponse = expectedProjects.map(project => helpers.makeExpectedProject(project))
                    
                return supertest(app)
                    .get(`/api/projects/c/${companyId}`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                    .expect(200, expectedResponse);
            });
        });
    });
    describe(`POST /api/projects/c/company_id`, () => {
         beforeEach("insert projects", () =>
           helpers.seedProjectsTables(
             db,
             testUsers,
             testProjects,
             testCompanies,
             testTasks
           )
         );
        it("adds a new project to the database when necessary fields provided", () => {
            const companyId = testCompanies[0].id;
            const project = {
              project_name: "Newly added project",
              description: "Everything should work just fine",
              dateadded: new Date("2029-01-27T16:28:32.615Z"),
              duedate: new Date("2029-03-21T16:28:32.615Z"),
              priority: "Medium"
            };
            return supertest(app)
                
              .post(`/api/projects/c/${companyId}`)
              .send(project)
              .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
              .expect(201)
              .expect((res) => {
                expect(res.body.project_name).to.eql(project.project_name);
                expect(res.body.description).to.eql(project.description);
                  expect(res.body.priority).to.eql(project.priority);
                  expect(res.body).to.have.property("id");
                  expect(res.body.id).to.eql(4);
              })

        })
    });
});