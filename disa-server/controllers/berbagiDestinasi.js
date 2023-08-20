const path = require("path");
const fs = require("fs");
const config = require("../config/config");
const BerbagiDestinasi = require("../models/berbagiDestinasi");

const index = async (req, res, next) => {
  try {
    const berbagiDestinasis = await BerbagiDestinasi.find();
    return res.json({ data: berbagiDestinasis });
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
        `public/images/berbagi/${filename}`
      );

      const src = fs.createReadStream(tmpPath);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          const berbagiDestinasi = new BerbagiDestinasi({
            ...payload,
            image_url: filename,
          });
          await berbagiDestinasi.save();
          return res.json(berbagiDestinasi);
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
      const berbagiDestinasi = new BerbagiDestinasi(payload);
      await berbagiDestinasi.save();
      return res.json(berbagiDestinasi);
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
        `public/images/berbagiDestinasi/${filename}`
      );

      const src = fs.createReadStream(tmpPath);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          const berbagiDestinasi = await BerbagiDestinasi.findById(id);
          const currentImage = `${config.rootPath}/public/images/berbagiDestinasi/${berbagiDestinasi.image_url}`;

          if (fs.existsSync(currentImage)) {
            berbagiDestinasi.image_url = filename;
            fs.unlinkSync(currentImage);
          }

          await berbagiDestinasi.save();
          const updatedBerbagiDestinasi =
            await BerbagiDestinasi.findByIdAndUpdate(id, payload, {
              new: true,
              runValidators: true,
            });

          return res.json(updatedBerbagiDestinasi);
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
      const updatedBerbagiDestinasi = await BerbagiDestinasi.findByIdAndUpdate(
        id,
        payload,
        {
          new: true,
          runValidators: true,
        }
      );
      return res.json(updatedBerbagiDestinasi);
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
    const berbagiDestinasi = await BerbagiDestinasi.findByIdAndDelete(
      req.params.id
    );
    const currentImage = `${config.rootPath}/public/images/berbagiDestinasi/${berbagiDestinasi.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    return res.json(`Berbagi destinasi ${berbagiDestinasi.name} deleted`);
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
