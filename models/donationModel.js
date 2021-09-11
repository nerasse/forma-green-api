const mongoose = require("mongoose");
require('mongoose-type-email');

const donationModel = mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true
    },
    montant: {
      type: String,
      trim: true,
      required: true
    },
    type: {
      type: String,
      trim: true,
      required: true
    }
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Donation", donationModel);