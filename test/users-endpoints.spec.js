const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const jwt = require('jsonwebtoken');

describe("Users Endpoints", function () {
    let db;

    const {
        testUsers,
        testCompanies,
        testProjects,
        testTasks,
    } = helpers.makeFixtures();

    before("make knex instance", () => {
        db = knex({
            client: "pg",
            connection: process.env.TEST_DATABASE_URL,
        });
        app.set("db", db);
    });

    after("disconnect from db", () => db.destroy());

    before("cleanup", () => helpers.cleanTables(db));

    afterEach("cleanup", () => helpers.cleanTables(db));

    describe(`GET /api/users/c/company_id`, () => {
        context(`Given users in the database`, () => {
            beforeEach("insert companies", () =>
                helpers.seedCompanies(db, testCompanies)
            );
            beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
            it(`responds with 200 and the list of users for a company`, () => {
                const companyId = testCompanies[0].id;
                const expectedUsers = testUsers.filter((user) =>
                    user.companyid === companyId)
             
                const expectedUsersForCompany = expectedUsers.map((user) =>
                    helpers.makeExpectedUser(user)
                );
                return supertest(app)
    
                    .get(`/api/users/c/${companyId}`)
                    .set("Authorization", helpers.makeAuthHeader(testUsers[0]))

                    .expect(200, expectedUsersForCompany);
            });
        });
    });
    describe(`PATCH /api/users/:user_id`, () => {
         beforeEach("insert companies", () =>
           helpers.seedCompanies(db, testCompanies)
         );
        beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
        it('updated the user with new values', () => { 
             const userId = 1;
             const updatedUserValues = {
               isadmin: true,
               email: "rb3@gmail.com",
               full_name: "Rebecca Smith",
             };
             const revisedUser = {
               ...testUsers[userId - 1],
               ...updatedUserValues,
             };
             const expectedUser = helpers.makeExpectedUser(revisedUser);
             return supertest(app)
               .patch(`/api/users/${userId}`)
               .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
               .send(updatedUserValues)
                .expect(201)
                 
             
        })
       
        
    });
    describe('POST /api/users', () => { 
         beforeEach("insert companies", () =>
           helpers.seedCompanies(db, testCompanies)
        );
        beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
        it("responds 200 and with the jwt token when registering", () => {
          const validUser = {
            "full_name": "Rick James",
            "email": "test@gmail.com",
            "password": "Johnsmith19#",
            "company_name": "Demo",
            "isadmin": false
          };
          const validUserId = testUsers[testUsers.length - 1].id + 1;
        
         const expectedToken = jwt.sign(
           {
             user_id: validUserId,
             companyid: 1,
             isadmin: validUser.isadmin,
             full_name: validUser.full_name,
           }, // payload
           process.env.JWT_SECRET,
           {
             subject: validUser.email,
             algorithm: "HS256",
           }
         );
            return supertest(app).post("/api/users").send(validUser).expect(201, { authToken: expectedToken }
            );
        });
    })
});