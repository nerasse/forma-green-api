const mongoose = require("mongoose");
require('mongoose-type-email');

const greenAreaModel = mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true
    },
    Coordonnees: {
      type: String,
      required: true,
      trim: true
    },
    etablissements: {
      type: [String],
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