import OpenAI from "openai";
import PptxGenJS from "pptxgenjs";
import { Document, Packer, Paragraph } from "docx";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

/* =========================
   🔐 SAFE OPENAI INIT
========================= */
const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

/* =========================
   🧠 SERMON CHAT (NEW 🔥)
========================= */
export const sermonChat = async (req, res) => {
  try {
    const openai = getOpenAI();

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        message: "Messages array is required",
      });
    }

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: messages,
    });

    const reply =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "No response generated";

    return res.json({ reply });

  } catch (err) {
    console.error("🔥 CHAT ERROR:", err);

    return res.status(500).json({
      message: err.message || "Chat failed",
    });
  }
};

/* =========================
   📄 GENERATE SERMON FILE
========================= */
export const generateSermonFile = async (req, res) => {
  console.log("🔥 AI ROUTE HIT:", req.body);

  try {
    const openai = getOpenAI();

    const { topic, type } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    /* =========================
       🧠 GENERATE SERMON TEXT
    ========================= */
    const aiResponse = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `
You are a powerful Christian pastor assistant.

Create a sermon about "${topic}" with:
- Title
- Key Bible verse
- 3 main points (each with scripture)
- Short explanation
- Conclusion

Make it impactful, inspiring, and clear.
Format as bullet points suitable for presentation slides.
      `,
    });

    /* =========================
       ✅ SAFE CONTENT EXTRACTION
    ========================= */
    const contentText =
      aiResponse.output_text ||
      aiResponse.output?.[0]?.content?.[0]?.text ||
      "";

    if (!contentText) {
      console.error("❌ NO AI CONTENT:", aiResponse);
      return res.status(500).json({
        message: "Failed to generate sermon content",
      });
    }

    const slides = contentText
      .split("\n")
      .filter((line) => line.trim() !== "");

    /* =========================
       📊 POWERPOINT
    ========================= */
    if (type === "ppt") {
      const pptx = new PptxGenJS();

      slides.forEach((text) => {
        const slide = pptx.addSlide();

        slide.addText(text, {
          x: 1,
          y: 1,
          fontSize: 20,
          color: "363636",
        });
      });

      const buffer = await pptx.write("nodebuffer");

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${topic}.pptx`
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      );

      return res.send(buffer);
    }

    /* =========================
       📄 WORD
    ========================= */
    if (type === "doc") {
      const doc = new Document({
        sections: [
          {
            children: slides.map((line) => new Paragraph(line)),
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${topic}.docx`
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );

      return res.send(buffer);
    }

    /* =========================
       📑 PDF
    ========================= */
    if (type === "pdf") {
      const pdf = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${topic}.pdf`
      );

      pdf.pipe(res);

      slides.forEach((line) => {
        pdf.text(line);
        pdf.moveDown();
      });

      pdf.end();
      return;
    }

    /* =========================
       📈 EXCEL
    ========================= */
    if (type === "xls") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Sermon");

      slides.forEach((line, i) => {
        sheet.getCell(`A${i + 1}`).value = line;
      });

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${topic}.xlsx`
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      await workbook.xlsx.write(res);
      return res.end();
    }

    /* =========================
       ❌ INVALID TYPE
    ========================= */
    return res.status(400).json({
      message: "Invalid file type. Use ppt, doc, pdf, or xls",
    });

  } catch (err) {
    console.error("🔥 FULL AI ERROR:", err);

    return res.status(500).json({
      message: err.message || "AI generation failed",
    });
  }
};