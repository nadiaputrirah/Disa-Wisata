const router = require("express").Router();
const multer = require("multer");
const os = require("os");
const informasiTerkiniController = require("../controllers/informasiTerkini");
const { policies_check } = require("../middlewares/index");

router.get("/informasi-terkini", informasiTerkiniController.index);
router.post(
  "/informasi-terkini",
  multer({ dest: os.tmpdir() }).single("image"),
  policies_check("create", "InformasiTerkini"),
  informasiTerkiniController.store
);
router.put(
  "/informasi-terkini/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  policies_check("update", "InformasiTerkini"),
  informasiTerkiniController.update
);
router.delete(
  "/informasi-terkini/:id",
  policies_check("delete", "InformasiTerkini"),
  informasiTerkiniController.destroy
);

module.exports = router;
