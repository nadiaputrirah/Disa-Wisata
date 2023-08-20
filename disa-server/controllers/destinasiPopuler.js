const DestinasiPopuler = require("../models/destinasiPopuler");

const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;
    let destinasiPopuler = await DestinasiPopuler.find()
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    return res.json(destinasiPopuler);
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let destinasi = new DestinasiPopuler(payload);
    await destinasi.save();
    return res.json(destinasi);
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
    let payload = req.body;
    let { id } = req.params;
    let destinasi = await DestinasiPopuler.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(destinasi);
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
    let destinasi = await DestinasiPopuler.findByIdAndDelete(req.params.id);
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
