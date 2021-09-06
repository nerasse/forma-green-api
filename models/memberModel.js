const mongoose = require("mongoose");
require('mongoose-type-email');

const memberModel = mongoose.Schema(
  {
    prenom: {
      type: String,
      required: true,
      trim: true
    },
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
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Member", memberModel);