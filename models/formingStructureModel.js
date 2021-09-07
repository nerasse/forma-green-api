const mongoose = require("mongoose");
require('mongoose-type-email');

const formingStructureModel = mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true
    },
    adresse: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("FormingStructure", formingStructureModel);