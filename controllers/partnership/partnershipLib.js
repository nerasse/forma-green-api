const Member = require("../../models/memberModel.js");
const Partnership = require("../../models/partnershipModel.js");
const jwt = require('jsonwebtoken');
const config = require("../../config/config");

async function ajout(req, res) {
  const { nom, adresse, secteur, memberToken } = req.body;
  //vérification du token
  if (!memberToken || !nom || !adresse || !secteur) {
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  try {
    let mail = '';
    jwt.verify(memberToken, config.secret, function (err, decoded) {
      mail = decoded.email
    });
    const findMember = await Member.findOne({ email: mail });
    if (!findMember)
      return res.status(401).json({
        text: "Token invalide !"
      });
    if (!findMember.admin) {
      return res.status(400).json({
        text: "Requête invalide"
      });
    }
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
  // génération du Partnership
  const data = {
    nom,
    adresse,
    secteur
  };
  try {
    // Sauvegarde du Partnership dans la base de données
    const Data = new Partnership(data);
    const Object = await Data.save();
    return res.status(200).json({ text: 'Partnership inscrit dans la base !' });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function data(req, res) {
  try {

    const data = await Partnership.find({});
    return res.status(200).json({ data: data })

  } catch (error) {
    return res.status(500).json({
      error
    });
  }
}

//export
exports.data = data;
exports.ajout = ajout;
