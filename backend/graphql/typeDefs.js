const { gql } = require("graphql-tag");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: String
    updated_at: String
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  type AuthPayload {
    message: String!
    user: User
  }

  type Query {
    login(usernameOrEmail: String!, password: String!): AuthPayload

    getAllEmployees: [Employee]

    searchEmployeeById(eid: ID!): Employee

    searchEmployeeByDesignationOrDepartment(
      designation: String
      department: String
    ): [Employee]
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User

    addEmployee(
      first_name: String!
      last_name: String!
      email: String!
      gender: String!
      designation: String!
      salary: Float!
      date_of_joining: String!
      department: String!
      employee_photo: String
    ): Employee

    updateEmployeeById(
      eid: ID!
      first_name: String
      last_name: String
      email: String
      gender: String
      designation: String
      salary: Float
      date_of_joining: String
      department: String
      employee_photo: String
    ): Employee

    deleteEmployeeById(eid: ID!): Employee
  }
`;

module.exports = typeDefs;
