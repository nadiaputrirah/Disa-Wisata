const router = require("express").Router();
const ulasanController = require("../controllers/ulasan");
const { policies_check } = require("../middlewares/index");

router.get("/ulasans", ulasanController.index);
router.post(
  "/ulasans",
  policies_check("create", "Ulasan"),
  ulasanController.store
);
router.put(
  "/ulasans/:id",
  policies_check("update", "Ulasan"),
  ulasanController.update
);
router.delete(
  "/ulasans/:id",
  policies_check("delete", "Ulasan"),
  ulasanController.destroy
);

module.exports = router;
