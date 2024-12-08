import express from "express";
import "dotenv/config";
import db from "./utils/database/db.js";

import bodyParser from "body-parser";
import route from "./utils/route/adminRoute.js";
import facultyRouter from "./utils/route/facultyRoute.js";
import courseRouter from "./utils/route/courseRoute.js";
const app = express();
const port = process.env.PORT || 5001;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/public/admin", express.static("public/admin"));
//admin route
app.use("/api/v1", route);
//faculty route
app.use("/api/v1", facultyRouter);
//course route
app.use("/api/v1", courseRouter);
app.listen(port, () => {
  console.log(`server is start on port: ${port}`);
  db();
});
