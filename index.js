const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const { APP_PORT } = require("./config");
const connectDB = require("./config/database");

const {
  formRoutes,
  userRoutes,
  workerRoutes,
  sectionRoutes,
  smartShedRoutes,
  supervisorRoutes,
  authorityRoutes,
  notificationRoutes,
  others,
} = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => res.send("Welcome to SmartShed API"));

app.use("/api/forms", formRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/supervisors", supervisorRoutes);
app.use("/api/authorities", authorityRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/create", smartShedRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", others);

app.listen(APP_PORT, () =>
  console.log(`Server is running on port ${APP_PORT}`)
);
