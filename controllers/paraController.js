const db = require("../database");

const getAllParagraphs = async (req, res) => {
  try {
    const query = "SELECT * FROM paragraphs;";
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching paragraphs:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching paragraphs" });
  }
};

const getParagraphById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM paragraphs where id = $1";
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Paragraph not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching paragraph by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching paragraph" });
  }
};

const createParagraph = async (req, res) => {
  try {
    const { content } = req.body;
    const query = "INSERT INTO paragraphs (content) VALUES ($1) RETURNING *";
    const result = await db.query(query, [content]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating paragraph:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating paragraph" });
  }
};

const updateParagraph = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const query =
      "UPDATE paragraphs SET content = $1 WHERE id = $2 RETURNING *";
    const result = await db.query(query, [content, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Paragraph not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating paragraph:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating paragraph" });
  }
};

const deleteParagraph = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM paragraphs WHERE id = $1 RETURNING *";
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Paragraph not found" });
    }
    res.status(200).json({ message: "Paragraph deleted successfully" });
  } catch (error) {
    console.error("Error deleting paragraph:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting paragraph" });
  }
};

const createParagraphBatch = async (req, res) => {
  try {
    const splitIntoParagraphs = (text) => {
      const paragraph = text.split("\n\n");
      return paragraph.map((paragraph) => paragraph.trim());
    };
    let { text } = req.body;
    if (typeof text !== "string") {
      text = String(text);
    }
    text = Array.isArray(text) ? text.join("\n") : text;

    const paragraphs = splitIntoParagraphs(text);
    let result;
    for (const paragraph of paragraphs) {
      const query = "INSERT INTO paragraphs (content) VALUES ($1)";
      const values = [paragraph];
      result = await db.query(query, values);
    }
    await mapWordsToParagraphs(req, res);
    res.status(201).json({ msg: "insert successfull" });
  } catch (error) {
    console.error("Error creating paragraphs:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while creating paragraphs",
    });
  }
};

const mapWordsToParagraphs = async (req, res) => {
  try {
    const paragraphsQuery = "SELECT id, content FROM paragraphs";
    const paragraphsResult = await db.query(paragraphsQuery);

    for (const paragraph of paragraphsResult.rows) {
      const paragraphId = paragraph.id;
      const content = paragraph.content;

      const words = content.split(/\s+/);

      for (const word of words) {
        const insertQuery =
          "INSERT INTO word_paragraph_mapping (word, paragraph_id) VALUES ($1, $2)";
        const insertValues = [word, paragraphId];
        await db.query(insertQuery, insertValues);
      }
    }

    /*res
      .status(200)
      .json({ message: "Mapping words to paragraphs completed successfully" });*/
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while mapping words to paragraphs" });
  }
};

const searchWord = async (req, res) => {
  try {
    const { word } = req.query;
    const query = `SELECT DISTINCT p.id, p.content FROM paragraphs p JOIN word_paragraph_mapping wpm ON p.id = wpm.paragraph_id WHERE wpm.word = $1 LIMIT 10;`;
    const result = await db.query(query, [word]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error searching word:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for the word" });
  }
};

module.exports = {
  getAllParagraphs,
  getParagraphById,
  createParagraph,
  updateParagraph,
  deleteParagraph,
  createParagraphBatch,
  mapWordsToParagraphs,
  searchWord,
};
