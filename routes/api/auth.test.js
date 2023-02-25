const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const should = require("should");

require("dotenv").config();

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
    mongoose.disconnect(() => done());
  });

  test("test login", async () => {
    const existingEmail = "example@gmail.com";
    const tmpPass = "password_hash";

    const encryptedPassword = await bcrypt.hash(tmpPass, 10);
    const user = await User.create({
      email: existingEmail,
      password: encryptedPassword,
    });

    const response = await request(server)
      .post("/api/users/login")
      .set("Content-Type", "application/json")
      .send({ email: existingEmail, password: tmpPass })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.statusCode).toBe(200);

    const responseBody = response.body;

    responseBody.should.have.property("token").which.is.a.String();

    const createdUser = responseBody.should.have
      .property("user")
      .which.is.a.Object();

    createdUser.obj.should.have.property("email").which.is.a.String();
    createdUser.obj.should.have.property("subscription").which.is.a.String();
    createdUser.obj.should.not.have.property("password");

    const existedUser = await User.findOne({ email: responseBody.user.email });

    should.exist(existedUser);

    await User.findByIdAndDelete(user._id);
  });
});
