const express = require("express");
const router = express.Router();
const db = require("./database");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("./controllers/userController");

const {
  getAllParagraphs,
  getParagraphById,
  createParagraph,
  updateParagraph,
  deleteParagraph,
  createParagraphBatch,
  mapWordsToParagraphs,
  searchWord,
} = require("./controllers/paraController");

const authenticateUser = require("./middlewares/authenticateUser");

router.use(express.json());

//user
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

//paras
router.get("/paragraphs", authenticateUser, getAllParagraphs);
router.get("/paragraphs/:id", authenticateUser, getParagraphById);
router.post("/paragraphs", authenticateUser, createParagraph);
router.put("/paragraphs/:id", authenticateUser, updateParagraph);
router.delete("/paragraphs/:id", authenticateUser, deleteParagraph);

router.post("/batch", authenticateUser, createParagraphBatch);
router.post("/map-words-to-paragraphs", authenticateUser, mapWordsToParagraphs);

//word find
router.get("/search", authenticateUser, searchWord);

module.exports = router;
