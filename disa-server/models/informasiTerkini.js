const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const informasiTerkiniSchema = new Schema(
  {
    judul: {
      type: String,
      required: [true, "Judul informasi harus diisi"],
      minlength: [3, "Judul informasi minimal 3 karakter"],
      maxlength: [100, "Judul informasi maksimal 100 karakter"],
    },
    konten: String,
    tglTerbit: {
      type: Date,
      default: Date.now,
    },
    image_url: String,
  },
  { timestamps: true }
);

module.exports = model("InformasiTerkini", informasiTerkiniSchema);
