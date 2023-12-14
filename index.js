const express = require("express");
const app = express();
const cors = require("cors");

const fs = require("fs");
const https = require("https");

app.use(cors());

const { APP_PORT, APP_HTTPS_PORT } = require("./config");
const connectDB = require("./config/database");

const {
  formRoutes,
  userRoutes,
  workerRoutes,
  sectionRoutes,
  smartShedRoutes,
  others,
} = require("./routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => res.send("Welcome to SmartShed API"));

app.use("/api/forms", formRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/create", smartShedRoutes);
app.use("/api", others);

app.listen(APP_PORT, () =>
  console.log(`Server is running on port ${APP_PORT}`)
);

const key = fs.readFileSync("private.key");
const cert = fs.readFileSync("certificate.crt");

const cred = { key: key, cert: cert };

const httpsServer = https.createServer(cred, app);

httpsServer.listen(APP_HTTPS_PORT, () => {
  console.log(`HTTPS Server running on port ${APP_HTTPS_PORT}`);
});
