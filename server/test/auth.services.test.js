const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel"); 
const authService = require("../services/auth.services");

// Mock bcrypt methods explicitly
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// Mock the User model
jest.mock("../models/userModel", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

beforeAll(() => {
  process.env.TOKEN_SECRET = "testsecretkey"; // Set a mock secret key for tests
});

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should successfully create a new user", async () => {
    // Mock User.findOne to return null (i.e., no user exists with that email)
    User.findOne.mockResolvedValue(null); // Simulating no existing user

    // Mock bcrypt.hash to return a hashed password
    bcrypt.hash.mockResolvedValue("hashedPassword");

    const userData = { email: "newuser@example.com", password: "password123", name: "New User" };

    // Mock the User.create method to simulate user creation
    User.create.mockResolvedValue({ id: 1, email: userData.email, name: userData.name });

    const result = await authService.signupUser(userData);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: userData.email } });
    expect(User.create).toHaveBeenCalledWith({
      email: userData.email,
      password: "hashedPassword", // Password should be hashed
      name: userData.name,
    });
    expect(result).toEqual({ id: 1, email: userData.email, name: userData.name });
  });

  it("should throw an error if the user already exists", async () => {
    // Mock User.findOne to simulate an existing user
    User.findOne.mockResolvedValue({ id: 1, email: "existing@example.com", name: "Existing User" });

    const userData = { email: "existing@example.com", password: "password123", name: "Existing User" };

    await expect(authService.signupUser(userData)).rejects.toThrow("User already exists.");
  });

  it("should successfully login the user and return a JWT", async () => {
    const user = { id: 1, email: "user@example.com", password: "hashedPassword", name: "John Doe" };

    // Mock User.findOne to return the user object
    User.findOne.mockResolvedValue(user);

    // Mock bcrypt.compare to return true (password matches)
    bcrypt.compare.mockResolvedValue(true);

    // Mock jwt.sign to return a fake JWT
    jwt.sign = jest.fn().mockReturnValue("fake-jwt-token");

    const result = await authService.loginUser({ email: user.email, password: "password123" });

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: user.email } });
    expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
    expect(result).toBe("fake-jwt-token");
  });

  it("should throw an error if the user is not found during login", async () => {
    const email = "nonexistent@example.com";
    const password = "password123";

    // Mock User.findOne to return null (user not found)
    User.findOne.mockResolvedValue(null);

    await expect(authService.loginUser({ email, password })).rejects.toThrow("User not found.");
  });

  it("should throw an error if the password is incorrect", async () => {
    const user = { id: 1, email: "user@example.com", password: "hashedPassword", name: "John Doe" };

    // Mock User.findOne to return the user object
    User.findOne.mockResolvedValue(user);

    // Mock bcrypt.compare to return false (passwords don't match)
    bcrypt.compare.mockResolvedValue(false);

    await expect(authService.loginUser({ email: user.email, password: "wrongPassword" }))
      .rejects.toThrow("Incorrect password.");
  });
});
