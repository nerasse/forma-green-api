const Member = require("../../models/memberModel.js");
const FormingStructure = require("../../models/formingStructureModel.js");
const jwt = require('jsonwebtoken');
const config = require("../../config/config");

async function ajout(req, res) {
  const { nom, adresse, memberToken } = req.body;
  //vérification du token
  if (!memberToken || !nom || !adresse) {
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
  // génération de la Forming Structure
  const data = {
    nom,
    adresse
  };
  try {
    // Sauvegarde de la Forming Structure dans la base de données
    const Data = new FormingStructure(data);
    const Object = await Data.save();
    return res.status(200).json({ text: 'Forming Structure inscrite dans la base !' });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function data(req, res) {
  try {
    console.log('yes papa')
    const data = await FormingStructure.find({});
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
