const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Employee = require("../models/Employee");
const {
  validateInput,
  signupSchema,
  loginSchema,
  addEmployeeSchema,
  updateEmployeeSchema,
} = require("../validators/validators");

const resolvers = {
  Query: {
    login: async (_, args) => {
      await validateInput(loginSchema, args);

      const user = await User.findOne({
        $or: [
          { username: args.usernameOrEmail },
          { email: args.usernameOrEmail },
        ],
      });

      if (!user) {
        throw new Error("Invalid username/email or password");
      }

      const isMatch = await bcrypt.compare(args.password, user.password);
      if (!isMatch) {
        throw new Error("Invalid username/email or password");
      }

      return {
        message: "Login successful",
        user,
      };
    },

    getAllEmployees: async () => {
      return await Employee.find();
    },

    searchEmployeeById: async (_, { eid }) => {
      const employee = await Employee.findById(eid);
      if (!employee) {
        throw new Error("Employee not found");
      }
      return employee;
    },

    searchEmployeeByDesignationOrDepartment: async (
      _,
      { designation, department }
    ) => {
      if (!designation && !department) {
        throw new Error("Please provide designation or department");
      }

      const filter = {};
      if (designation) filter.designation = new RegExp(designation, "i");
      if (department) filter.department = new RegExp(department, "i");

      return await Employee.find({
        $or: Object.entries(filter).map(([key, val]) => ({ [key]: val })),
      });
    },
  },

  Mutation: {
    signup: async (_, args) => {
      await validateInput(signupSchema, args);

      const existingUser = await User.findOne({
        $or: [{ username: args.username }, { email: args.email }],
      });
      if (existingUser) {
        throw new Error("Username or email already exists");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(args.password, salt);

      const newUser = new User({
        username: args.username,
        email: args.email,
        password: hashedPassword,
      });

      return await newUser.save();
    },

    addEmployee: async (_, args) => {
      await validateInput(addEmployeeSchema, args);

      const existingEmployee = await Employee.findOne({ email: args.email });
      if (existingEmployee) {
        throw new Error("An employee with this email already exists");
      }

      const newEmployee = new Employee({
        first_name: args.first_name,
        last_name: args.last_name,
        email: args.email,
        gender: args.gender,
        designation: args.designation,
        salary: args.salary,
        date_of_joining: new Date(args.date_of_joining),
        department: args.department,
        employee_photo: args.employee_photo || null,
      });

      return await newEmployee.save();
    },

    updateEmployeeById: async (_, { eid, ...updates }) => {
      await validateInput(updateEmployeeSchema, { eid, ...updates });

      if (updates.date_of_joining) {
        updates.date_of_joining = new Date(updates.date_of_joining);
      }

      const cleanUpdates = {};
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          cleanUpdates[key] = value;
        }
      }

      const employee = await Employee.findByIdAndUpdate(eid, cleanUpdates, {
        new: true,
        runValidators: true,
      });

      if (!employee) {
        throw new Error("Employee not found");
      }

      return employee;
    },

    deleteEmployeeById: async (_, { eid }) => {
      const employee = await Employee.findByIdAndDelete(eid);
      if (!employee) {
        throw new Error("Employee not found");
      }
      return employee;
    },
  },
};

module.exports = resolvers;
