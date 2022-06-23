const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const pdfParse = require("pdf-parse");
const readPdf = require("./pdfGenerate.js");
var bodyParser = require("body-parser");
const { time } = require("console");
const fs = require("fs");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const port = process.env.PORT || 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/pdfanalyse", upload.single("pdf"), async (req, res) => {
  await readPdf(req.file.buffer, req.file.originalname);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  res.sendFile("./Analyzed.pdf", { root: __dirname });
});

app.listen(port, () => {
  console.log("Server started on", port);
});
