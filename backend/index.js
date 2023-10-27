const express = require("express");
const cors = require("cors");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const schema = require("./schema.js");

const app = express();
const port = 4000;

// For Cross origin resource sharing
app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
