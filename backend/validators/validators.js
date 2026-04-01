const { checkSchema, validationResult } = require("express-validator");

async function validateInput(schema, data) {
  const req = { body: data };
  const res = {};
  const validations = checkSchema(schema, ["body"]);

  for (const validation of validations) {
    await validation.run(req);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    throw new Error(messages.join(", "));
  }
}

const signupSchema = {
  username: {
    notEmpty: { errorMessage: "Username is required" },
    isLength: {
      options: { min: 3 },
      errorMessage: "Username must be at least 3 characters",
    },
    trim: true,
  },
  email: {
    notEmpty: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Invalid email format" },
    normalizeEmail: true,
  },
  password: {
    notEmpty: { errorMessage: "Password is required" },
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters",
    },
  },
};

const loginSchema = {
  usernameOrEmail: {
    notEmpty: { errorMessage: "Username or email is required" },
    trim: true,
  },
  password: {
    notEmpty: { errorMessage: "Password is required" },
  },
};

const addEmployeeSchema = {
  first_name: {
    notEmpty: { errorMessage: "First name is required" },
    trim: true,
  },
  last_name: {
    notEmpty: { errorMessage: "Last name is required" },
    trim: true,
  },
  email: {
    notEmpty: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Invalid email format" },
    normalizeEmail: true,
  },
  gender: {
    notEmpty: { errorMessage: "Gender is required" },
    isIn: {
      options: [["Male", "Female", "Other"]],
      errorMessage: "Gender must be Male, Female, or Other",
    },
  },
  designation: {
    notEmpty: { errorMessage: "Designation is required" },
    trim: true,
  },
  salary: {
    notEmpty: { errorMessage: "Salary is required" },
    isFloat: {
      options: { min: 1000 },
      errorMessage: "Salary must be at least 1000",
    },
    toFloat: true,
  },
  date_of_joining: {
    notEmpty: { errorMessage: "Date of joining is required" },
    isISO8601: { errorMessage: "Date of joining must be a valid date" },
  },
  department: {
    notEmpty: { errorMessage: "Department is required" },
    trim: true,
  },
};

const updateEmployeeSchema = {
  eid: {
    notEmpty: { errorMessage: "Employee ID is required" },
    isMongoId: { errorMessage: "Invalid Employee ID format" },
  },
  email: {
    optional: true,
    isEmail: { errorMessage: "Invalid email format" },
  },
  gender: {
    optional: true,
    isIn: {
      options: [["Male", "Female", "Other"]],
      errorMessage: "Gender must be Male, Female, or Other",
    },
  },
  salary: {
    optional: true,
    isFloat: {
      options: { min: 1000 },
      errorMessage: "Salary must be at least 1000",
    },
  },
  date_of_joining: {
    optional: true,
    isISO8601: { errorMessage: "Date of joining must be a valid date" },
  },
};

module.exports = {
  validateInput,
  signupSchema,
  loginSchema,
  addEmployeeSchema,
  updateEmployeeSchema,
};
