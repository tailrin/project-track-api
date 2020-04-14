const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const jwt = require("jsonwebtoken");

describe("Auth Endpoints", function () {
  let db;

  const { testCompanies, testUsers } = helpers.makeFixtures();

  const testUser = testUsers[0];

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

    describe(`POST /api/auth/login`, () => {
        beforeEach("insert companies", () => helpers.seedCompanies(db,testCompanies));  
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

    const requiredFields = ["email", "password"];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        password: testUser.password,
        email:testUser.email
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post("/api/auth/login")
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });
 
    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
        email: testUser.email,
        password: testUser.password,
      };
      const expectedToken = jwt.sign(
        { user_id: testUser.id, companyid:testUser.companyid, isadmin:testUser.isadmin, full_name:testUser.full_name }, // payload
        process.env.JWT_SECRET,
        {
          subject: testUser.email,
          algorithm: "HS256",
        }
      );
      return supertest(app)
        .post("/api/auth/login")
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken,
        });
    });
  });
});
