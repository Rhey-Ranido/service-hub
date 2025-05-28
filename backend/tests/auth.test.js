// tests/auth.test.js
import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js"; // your exported Express app

let adminToken;
let providerToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Register admin user
  await request(app).post("/api/auth/register").send({
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  });

  // Register provider user
  await request(app).post("/api/auth/register").send({
    email: "provider@example.com",
    password: "provider123",
    role: "provider",
  });

  // Login as admin
  const adminRes = await request(app).post("/api/auth/login").send({
    email: "admin@example.com",
    password: "admin123",
  });
  adminToken = adminRes.body.token;

  // Login as provider
  const providerRes = await request(app).post("/api/auth/login").send({
    email: "provider@example.com",
    password: "provider123",
  });
  providerToken = providerRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Protected Routes", () => {
  it("should allow admin to access /admin route", async () => {
    const res = await request(app)
      .get("/api/protected/admin")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Welcome admin");
  });

  it("should deny provider access to /admin route", async () => {
    const res = await request(app)
      .get("/api/protected/admin")
      .set("Authorization", `Bearer ${providerToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Access denied");
  });

  it("should allow provider to access /provider route", async () => {
    const res = await request(app)
      .get("/api/protected/provider")
      .set("Authorization", `Bearer ${providerToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Welcome provider");
  });

  it("should deny admin access to /provider route (if restricted)", async () => {
    const res = await request(app)
      .get("/api/protected/provider")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(403);
  });
});
