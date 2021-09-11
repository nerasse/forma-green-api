const Member = require("../../models/memberModel.js");
const GreenArea = require("../../models/greenAreaModel.js");
const jwt = require('jsonwebtoken');
const config = require("../../config/config");

async function ajout(req, res) {
  const { nom, coordonnees, etablissement, plantes, memberToken } = req.body;
  //vérification du token
  if (!memberToken || !nom || !coordonnees || !etablissement || !plantes) {
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
  // génération de la Green Area
  const data = {
    nom,
    coordonnees,
    etablissement,
    plantes
  };
  try {
    // Sauvegarde de la Green Area dans la base de données
    const Data = new GreenArea(data);
    const Object = await Data.save();
    return res.status(200).json({ text: 'Green Area inscrite dans la base !' });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function data(req, res) {
  try {

    const data = await GreenArea.find({});
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
