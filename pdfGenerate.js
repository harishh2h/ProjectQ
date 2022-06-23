const fs = require("fs");
const pdfParse = require("pdf-parse");
const md5 = require("md5");
const PDFDocument = require("pdfkit");

const readPdf = async (buffer, pdfname) => {
  // const buffer = fs.readFileSync(url);
  try {
    const data = await pdfParse(buffer);
    let dataArr = [...data.text.split("SECTION")];
    let SectionA = [...dataArr[1].split("\n")];
    SectionA.shift();
    SectionA.shift();
    SectionA.pop();
    SectionA.pop();

    let SectionB = [...dataArr[2].split("\n")];
    SectionB.shift();
    SectionB.shift();
    SectionB.shift();
    SectionB.pop();
    SectionB.pop();

    // console.log(SectionB);

    let SectionC = [...dataArr[3].split("\n")];
    SectionC.shift();
    SectionC.shift();
    SectionC.shift();
    SectionC.pop();

    let patternA = [
      "choose",
      "define",
      "find",
      "identify",
      "indicate",
      "list",
      "label",
      "match",
      "name",
      "state",
      "what",
      "when",
      "where",
      "who",
      "which",
      "tell",
      "recite",
      "outline",
      "select",
      "comprehend",
      "demonstrate",
    ];

    let patternB = [
      "analyze",
      "classify",
      "determine",
      "discuss",
      "evaluate",
      "explain",
      "illustrate",
      "justify",
      "prepare",
      "show",
      "sketch",
      "solve",
      "state",
      "calculate",
      "modify",
      "compute",
      "compile",
      "execute",
      "compliment",
      "map",
      "plot",
      "implement",
    ];

    let patternC = [
      "analyze",
      "classify",
      "determine",
      "discuss",
      "evaluate",
      "explain",
      "illustrate",
      "justify",
      "solve",
      "formulate",
      "construct",
      "interpret",
      "deduce",
      "calculate",
      "develop",
      "assess",
      "differentiate",
      "elucidate",
      "elaborate",
      "enumare",
      "compare",
      "implement",
      "apprise",
      "outline",
      "predict",
      "generate",
      "create",
      "conclude",
      "estimate",
      "simplify",
      "design",
      "rewrite",
    ];

    let regexA = new RegExp("/" + patternA.join(" | ") + "/", "i");
    let regexB = new RegExp("/" + patternB.join(" | ") + "/", "i");
    let regexC = new RegExp("/" + patternC.join(" | ") + "/", "i");
    let satA = 0;
    let unSatA = 0;

    let satB = 0;
    let unSatB = 0;

    let satC = 0;
    let unSatC = 0;

    SectionA.forEach((question) => {
      if (regexA.test(question)) {
        satA = satA + 1;
      } else {
        unSatA = unSatA + 1;
      }
    });

    SectionB.forEach((question) => {
      if (regexB.test(question)) {
        satB = satB + 1;
      } else {
        unSatB = unSatB + 1;
      }
    });

    SectionC.forEach((question) => {
      if (regexC.test(question)) {
        satC = satC + 1;
      } else {
        unSatC = unSatC + 1;
      }
    });

    let totSat = satA + satB + satC;
    let totUnsat = unSatA + unSatB + unSatC;

    // SectionC.forEach((question) => {
    //   console.log(question.toLowerCase(), regexC.test(question.toLowerCase()));
    // });
    const ChartJsImage = require("chartjs-to-image");
    const chart = new ChartJsImage();

    chart.setConfig({
      type: "pie",
      data: {
        labels: ["Satisfied Questions ", "Unsatisfied Questions"],
        datasets: [{ label: "Foo", data: [totSat, totUnsat] }],
      },
    });
    chart.setWidth(500).setHeight(300).setBackgroundColor("White");

    // console.log(chart.getUrl());
    chart.toFile("./uploads/all.png");

    chart.setConfig({
      type: "pie",
      data: {
        labels: ["Satisfied Questions ", "Unsatisfied Questions"],
        datasets: [{ label: "Section A", data: [satA, unSatA] }],
      },
    });
    chart.setWidth(500).setHeight(300).setBackgroundColor("White");

    // console.log(chart.getUrl());
    chart.toFile("./uploads/A.png");

    chart.setConfig({
      type: "pie",
      data: {
        labels: ["Satisfied Questions ", "Unsatisfied Questions"],
        datasets: [{ label: "Section B", data: [satB, unSatB] }],
      },
    });
    chart.setWidth(500).setHeight(300).setBackgroundColor("White");

    // console.log(chart.getUrl());
    chart.toFile("./uploads/B.png");

    chart.setConfig({
      type: "pie",
      data: {
        labels: ["Satisfied Questions ", "Unsatisfied Questions"],
        datasets: [{ label: "Section C", data: [satC, unSatC] }],
      },
    });
    chart.setWidth(500).setHeight(300).setBackgroundColor("White");

    // console.log(chart.getUrl());
    chart.toFile("./uploads/C.png");

    const doc = new PDFDocument();

    const generatePDF = async () => {
      doc.pipe(fs.createWriteStream("Analyzed.pdf"));
      doc
        .fontSize(12)
        .text(pdfname.slice(0, -4) + " Pattern Analysis", 100, 100, {
          align: "center",
        })
        .fontSize(8)
        .text("  ")
        .text("  ")
        .text(`HASH VALUE : ${md5(buffer)}`, {
          align: "center",
        })
        .fontSize(12)
        .text("  ")
        .text(" ******  ", {
          align: "center",
        })
        .text("   ")
        .text("ALL Question Paper Pattern Analysis Result", {
          align: "center",
        })

        .text(" ")
        .text(" ")
        .text(` Pattern Satisfied Questions : ${totSat} `, { align: "center" })
        .text(` Pattern Unsatisfied Questions : ${totUnsat} `, {
          align: "center",
        })

        .image("./uploads/all.png", {
          fit: [350, 350],
          align: "center",
          valign: "center",
        })
        .addPage()
        .text("Section A - Pattern Analysis Result", 100, 100, {
          align: "center",
        })

        .text(" ")
        .text(" ")
        .text(`Section A - Pattern Satisfied Questions : ${satA} `, {
          align: "center",
        })
        .text(`Section A - Pattern Unsatisfied Questions : ${unSatA} `, {
          align: "center",
        })

        .image("./uploads/A.png", {
          fit: [350, 350],
          align: "center",
          valign: "center",
        })
        .addPage()
        .text("Section B - Pattern Analysis Result", 100, 100, {
          align: "center",
        })

        .text(`Section B - Pattern Satisfied Questions : ${satB} `, {
          align: "center",
        })
        .text(`Section B - Pattern Unsatisfied Questions : ${unSatB} `, {
          align: "center",
        })
        .image("./uploads/B.png", {
          fit: [350, 350],
          align: "center",
          valign: "center",
        })
        .addPage()
        .text("Section C   - Pattern Analysis Result", 100, 100, {
          align: "center",
        })

        .text(`Section C - Pattern Satisfied Questions : ${satC} `, {
          align: "center",
        })
        .text(`Section C - Pattern Unsatisfied Questions : ${unSatC} `, {
          align: "center",
        })
        .image("./uploads/C.png", {
          fit: [350, 350],
          align: "center",
          valign: "center",
        });
      doc.end();
    };
    await generatePDF();

    // console.log("Completed");
  } catch (error) {
    console.log(error);
  }
};

module.exports = readPdf;

// const dummy_pdf = "./Web Programming with PHP _ MYSQL - End Sem Exam QP.pdf";
