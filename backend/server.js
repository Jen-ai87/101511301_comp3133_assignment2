const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();
let initialized = false;

async function initialize() {
  if (initialized) return;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  app.use(
    "/graphql",
    cors({ origin: "*" }),
    bodyParser.json(),
    expressMiddleware(server)
  );
  initialized = true;
}

app.use(async (req, res, next) => {
  try {
    await initialize();
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  initialize().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}/graphql`);
    });
  }).catch((err) => {
    console.error("Failed to start server:", err);
  });
}
