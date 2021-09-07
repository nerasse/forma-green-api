const mongoose = require("mongoose");
require('mongoose-type-email');

const benevoleModel = mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      lowercase: true,
      trim: true,
      unique: true,
      required: true
    },
    partnerships: {
      type: [String],
      required: true,
      trim: true
    },
    date_fin_abo: {
      type: Date,
      required: true
    },
    etablissement: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Benevole", benevoleModel);