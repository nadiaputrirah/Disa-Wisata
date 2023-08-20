const Ulasan = require("../models/ulasan");

const index = async (req, res, next) => {
  try {
    const ulasans = await Ulasan.find();
    return res.json({ data: ulasans });
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const payload = req.body;
    const ulasan = new Ulasan(payload);
    await ulasan.save();
    return res.json(ulasan);
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

    const updatedUlasan = await Ulasan.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(updatedUlasan);
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
    const ulasan = await Ulasan.findByIdAndDelete(req.params.id);
    return res.json(`Ulasan by ${ulasan.nama} deleted`);
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
