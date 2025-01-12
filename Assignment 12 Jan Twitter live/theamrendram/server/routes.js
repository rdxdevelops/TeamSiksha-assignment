const {
  deleteDataBySlug,
  getDataBySlug,
  updateDataBySlug,
  searchData
} = require("./controllers");
const router = require("express").Router();

router.get("/event/:slug", getDataBySlug);
router.put("/:slug", updateDataBySlug);
router.delete("/:slug", deleteDataBySlug);
router.get("/search", searchData);

module.exports = router;
