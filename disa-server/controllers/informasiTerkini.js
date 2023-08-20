const path = require("path");
const fs = require("fs");
const config = require("../config/config");
const InformasiTerkini = require("../models/informasiTerkini");

const index = async (req, res, next) => {
  try {
    const informasiTerkinis = await InformasiTerkini.find();
    return res.json({ data: informasiTerkinis });
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const payload = req.body;

    if (req.file) {
      const tmpPath = req.file.path;
      const originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      const filename = req.file.filename + "." + originalExt;
      const targetPath = path.resolve(
        config.rootPath,
        `public/images/informasi/${filename}`
      );

      const src = fs.createReadStream(tmpPath);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          const informasiTerkini = new InformasiTerkini({
            ...payload,
            image_url: filename,
          });
          await informasiTerkini.save();
          return res.json(informasiTerkini);
        } catch (err) {
          fs.unlinkSync(targetPath);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });

      src.on("error", (err) => {
        next(err);
      });
    } else {
      const informasiTerkini = new InformasiTerkini(payload);
      await informasiTerkini.save();
      return res.json(informasiTerkini);
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const payload = req.body;
    const { id } = req.params;

    if (req.file) {
      const tmpPath = req.file.path;
      const originalExt = req.file.originalname.split(".").pop();
      const filename = req.file.filename + "." + originalExt;
      const targetPath = path.resolve(
        config.rootPath,
        `public/images/informasi-terkini/${filename}`
      );

      const src = fs.createReadStream(tmpPath);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          const informasiTerkini = await InformasiTerkini.findById(id);
          const currentImage = `${config.rootPath}/public/images/informasi-terkini/${informasiTerkini.image_url}`;

          if (fs.existsSync(currentImage)) {
            informasiTerkini.image_url = filename;
            fs.unlinkSync(currentImage);
          }

          await informasiTerkini.save();
          const updatedInformasiTerkini =
            await InformasiTerkini.findByIdAndUpdate(id, payload, {
              new: true,
              runValidators: true,
            });

          return res.json(updatedInformasiTerkini);
        } catch (err) {
          fs.unlinkSync(targetPath);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });

      src.on("error", (err) => {
        next(err);
      });
    } else {
      const updatedInformasiTerkini = await InformasiTerkini.findByIdAndUpdate(
        id,
        payload,
        { new: true, runValidators: true }
      );
      return res.json(updatedInformasiTerkini);
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const informasiTerkini = await InformasiTerkini.findByIdAndDelete(
      req.params.id
    );
    const currentImage = `${config.rootPath}/public/images/informasi-terkini/${informasiTerkini.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    return res.json(`Informasi Terkini ${informasiTerkini.title} deleted`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  store,
  index,
  update,
  destroy,
};
