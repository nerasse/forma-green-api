const User = require("../../models/userModel.js");
const Member = require("../../models/memberModel.js");
const Benevole = require("../../models/benevoleModel.js");
const ModelDev = require("../../models/greenAreaModel.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("../../config/config");


async function infoUser(req, res) {
  const { token, type } = req.body;
  //vérifie si le token est présent
  if (!token || !type) {
    return res.status(400).json({
      text: "Requête invalide"
    });
  }

  try {
    let findEmail = '';
    jwt.verify(token, config.secret, function (err, decoded) {
      findEmail = decoded.email;
    });
    if (type === 'benevole') {
      const findBenevole = await Benevole.findOne({ email: findEmail });
      if (!findBenevole)
        return res.status(401).json({
          text: "Le bénévole n'existe pas"
        });
      const nom = findBenevole.nom;
      const email = findBenevole.email;
      const etablissement = findBenevole.etablissement
      const qr = findBenevole._id.toString();
      return res.status(200).json({ nom, email, etablissement, qr, user: 'benevole', admin: false });
    } else {
      const findMember = await Member.findOne({ email: findEmail });
      if (!findMember)
        return res.status(401).json({
          text: "Le membre n'existe pas"
        });
      const nom = findMember.nom;
      const email = findMember.email;
      const etablissement = findMember.etablissement;
      const qr = findMember._id.toString();
      console.log(qr)
      const isAdmin = findMember.admin;
      return res.status(200).json({ nom, email, etablissement, qr, user: 'member', admin: isAdmin });
    }
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
}



async function dev(req, res) {
  const add = async function () {
    const Benevole = require('../../models/benevoleModel');
    const mdp = await bcrypt.hashSync('Azerty01', 10)
    const newDate = new Date('2021-12-31T23:59:59');
    const data = {
      nom: 'Green Area 7',
      coordonnees: ['48.84003425274501', '2.3178773853974457'],
      etablissement: '613d2ddc5d4023e52376eeaa',
      plantes: ['Cactus', 'Tulipe']
    };
    const Data = new ModelDev(data);
    const Object = await Data.save()
  }
  //add();
  return res.status(200).json({ test: "okkk" });
}

//export
exports.dev = dev;
exports.infoUser = infoUser;