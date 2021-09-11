const mongoose = require("mongoose");
require('mongoose-type-email');

const greenAreaModel = mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true
    },
    coordonnees: {
      type: [String],
      required: true,
      trim: true
    },
    etablissement: {
      type: String,
      required: true,
      trim: true
    },
    plantes: {
      type: [String],
      required: true,
      trim: true
    }
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("GreenArea", greenAreaModel);