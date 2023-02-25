const mongoose = require("mongoose");
const request = require("supertest");
const should = require("should");

require("dotenv").config();

// jest.useFakeTimers("legacy");

mongoose.set("strictQuery", false);

const app = require("../../app");
const { User } = require("../../models/user");

const { DB_HOST, PORT } = process.env;

describe("test login route", () => {
  let server;

  beforeAll(() => (server = app.listen(PORT)));
  afterAll(() => server.close());

  beforeEach((done) => {
    mongoose.connect(DB_HOST).then(() => done());
  });

  afterEach((done) => {
    mongoose.connection.db.dropCollection(() => {
      mongoose.connection.close(() => done());
    });
  });

  test("test login route", async () => {
    const loginUser = {
      email: "bla2@gmail.com",
      password: "123456",
    };

    const response = await request(app)
      .post("/api/users/login")
      .send(loginUser);
    expect(response.statusCode).toBe(200);

    const { body } = response;

    const user = body.user;

    user.should.have.property("subscription").which.is.a.String();
    user.should.have.property("email").which.is.a.String();
    body.should.have.property("token");
  });
});
