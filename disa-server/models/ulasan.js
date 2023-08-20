const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const ulasanSchema = new Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama harus diisi"],
      minlength: [3, "Nama minimal 3 karakter"],
      maxlength: [50, "Nama maksimal 50 karakter"],
    },
    ulasan: {
      type: String,
      required: [true, "Ulasan harus diisi"],
      minlength: [10, "Ulasan minimal 10 karakter"],
      maxlength: [500, "Ulasan maksimal 500 karakter"],
    },
  },
  { timestamps: true }
);

module.exports = model("Ulasan", ulasanSchema);
