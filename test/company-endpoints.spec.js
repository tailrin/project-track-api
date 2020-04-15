const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Company Endpoints", function () {const { testCompanies, testUsers } = helpers.makeFixtures();

    let db;

    
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

    describe("POST /api/company", () => {
        it("responds 200 when company name provided", () => {
            const company = {
                company_name: "Fleetwater"
            };
            console.log(helpers.makeAuthHeader(testUsers[0]));

            return supertest(app)
                .post("/api/company")
                .send(company)
                .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => {
                    expect(res.body.company_name).to.eql(company.company_name);
                });
        });
    });
});

  