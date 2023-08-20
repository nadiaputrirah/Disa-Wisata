const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const destinasiSchema = new Schema(
  {
    nama_destinasi: {
      type: String,
      minlength: [3, "Destination name must be at least 3 characters long"],
      maxlength: [50, "Destination name must be at most 50 characters long"],
      required: [true, "Destination name is required"],
    },

    image_url: String,

    alamat: {
      type: String,
      maxlength: [255, "Address must be at most 255 characters long"],
    },
    jam_operasi: {
      type: String,
      maxlength: [100, "Operating hours must be at most 100 characters long"],
    },

    deskripsi: {
      type: String,
      maxlength: [1000, "Description must be at most 1000 characters long"],
    },
  },
  { timestamps: true }
);

module.exports = model("Destinasi", destinasiSchema);
