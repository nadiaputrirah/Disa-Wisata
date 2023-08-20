const router = require("express").Router();
const multer = require("multer");
const os = require("os");
const berbagiDestinasiController = require("../controllers/berbagiDestinasi");
const { policies_check } = require("../middlewares/index");

router.get("/berbagi-destinasi", berbagiDestinasiController.index);
router.post(
  "/berbagi-destinasi",
  multer({ dest: os.tmpdir() }).single("image"),
  policies_check("create", "BerbagiDestinasi"),
  berbagiDestinasiController.store
);
router.put(
  "/berbagi-destinasi/:id",
  multer({ dest: os.tmpdir() }).single("image"),
  policies_check("update", "BerbagiDestinasi"),
  berbagiDestinasiController.update
);
router.delete(
  "/berbagi-destinasi/:id",
  policies_check("delete", "BerbagiDestinasi"),
  berbagiDestinasiController.destroy
);

module.exports = router;
