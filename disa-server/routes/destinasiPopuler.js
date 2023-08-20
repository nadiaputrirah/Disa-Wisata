const router = require("express").Router();
const multer = require("multer");
const os = require("os");
const destinasiPopulerController = require("../controllers/destinasiPopuler");
const { policies_check } = require("../middlewares/index");

router.get("/destinasi-populer", destinasiPopulerController.index);
router.post(
  "/destinasi-populer",
  multer({ dest: os.tmpdir() }).single("image"),
  policies_check("create", "DestinasiPopuler"),
  destinasiPopulerController.store
);
router.put(
  "/destinasi-populer/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  policies_check("update", "DestinasiPopuler"),
  destinasiPopulerController.update
);
router.delete(
  "/destinasi-populer/:id",
  policies_check("delete", "DestinasiPopuler"),
  destinasiPopulerController.destroy
);

module.exports = router;
