const express = require("express");
const db = require("./database");
const app = express();
const PORT = 4000;
const routes = require("./routes");

const jsonMiddleware = require("./middlewares/jsonMiddleware");
const serverErrorMiddleware = require("./middlewares/serverErrorMiddleware");

app.use(jsonMiddleware);

app.use("/api", routes);

app.get("/", (req, res) => {
  return res.send("Hello from Server!");
});

app.use(serverErrorMiddleware);

const server = app.listen(PORT, () =>
  console.log(`Server running on PORT: ${PORT}`)
);

server.on("error", (err) => {
  console.error("Server error:", err);
});
