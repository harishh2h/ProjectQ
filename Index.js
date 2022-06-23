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
  //   const data = await pdfParse(req.file.buffer);
  let data = await readPdf(req.file.buffer, req.file.originalname);
  // console.log("analyse completed", data);
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function sleep() {
    await timeout(4000);
    return "time compelted";
  }
  let waitTime = await sleep();

  res.sendFile("./Analyzed.pdf", { root: __dirname });
  // fs.unlinkSync("./Analyzed.pdf");
});

app.listen(port, () => {
  console.log("Server started on", port);
});

module.exports = app;
