const path = require("path");
const fs = require("fs");
const config = require("../config/config");
const Destinasi = require("../models/destinasi"); // Pastikan Anda memiliki model "Destinasi"

const index = async (req, res, next) => {
  try {
    const destinasiList = await Destinasi.find();
    return res.json({ data: destinasiList });
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
        `public/images/destinasi/${filename}`
      );

      const src = fs.createReadStream(tmpPath);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          const destinasi = new Destinasi({
            ...payload,
            image_url: filename,
          });
          await destinasi.save();
          return res.json(destinasi);
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
      const destinasi = new Destinasi(payload);
      await destinasi.save();
      return res.json(destinasi);
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
      const originalExt =
        req.file.originalname.split(".")[
          req.file.originalname.split(".").length - 1
        ];
      const filename = req.file.filename + "." + originalExt;
      const targetPath = path.resolve(
        config.rootPath,
        `public/images/destinasi/${filename}`
      );

      const src = fs.createReadStream(tmpPath);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          const destinasi = await Destinasi.findById(id);
          const currentImage = `${config.rootPath}/public/images/destinasi/${destinasi.image_url}`;

          if (fs.existsSync(currentImage)) {
            destinasi.image_url = filename;
            fs.unlinkSync(currentImage);
          }

          await destinasi.save();
          const updatedDestinasi = await Destinasi.findByIdAndUpdate(
            id,
            payload,
            {
              new: true,
              runValidators: true,
            }
          );

          return res.json(updatedDestinasi);
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
      const updatedDestinasi = await Destinasi.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
      return res.json(updatedDestinasi);
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
    const destinasi = await Destinasi.findByIdAndDelete(req.params.id);
    const currentImage = `${config.rootPath}/public/images/destinasi/${destinasi.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    return res.json(`Destinasi ${destinasi.name} deleted`);
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
