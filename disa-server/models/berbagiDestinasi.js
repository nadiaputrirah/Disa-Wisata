const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const berbagiDestinasiSchema = new Schema(
  {
    deskripsi: {
      type: String,
      required: [true, "Deskripsi harus diisi"],
      minlength: [10, "Deskripsi minimal 10 karakter"],
      maxlength: [500, "Deskripsi maksimal 500 karakter"],
    },
    alamat: {
      type: String,
      required: [true, "Alamat harus diisi"],
      minlength: [5, "Alamat minimal 5 karakter"],
      maxlength: [200, "Alamat maksimal 200 karakter"],
    },
    image_url: String,
  },
  { timestamps: true }
);

module.exports = model("BerbagiDestinasi", berbagiDestinasiSchema);
