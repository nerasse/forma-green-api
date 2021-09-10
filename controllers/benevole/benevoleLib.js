const Benevole = require("../../models/benevoleModel.js");
const Member = require("../../models/memberModel.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("../../config/config");
const { find } = require("../../models/benevoleModel.js");

const regexPassword = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}))/g;
const regexName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

async function register(req, res) {
  const { password, email, nom, partnerships, date_fin_abo, etablissement, memberToken } = req.body;
  let newEtablissement = etablissement;
  //email et password non null
  if (!email || !password) {
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  if (!regexName.test(nom)) {
    return res.status(400).json({
      text: "Nom Invalide"
    });
  }
  if (!regexPassword.test(password)) {
    return res.status(400).json({
      text: "Password Invalide"
    });
  }
  //vérification du token
  if (!memberToken) {
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
      if (findMember.admin == false) {
        newEtablissement = findMember.etablissement
      }
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
  // génération du benevole
  const benevole = {
    nom,
    email,
    partnerships,
    date_fin_abo,
    newEtablissement,
    password: bcrypt.hashSync(password, 10)
  };
  // verif dans la base si déjà existant
  try {
    const findBenevole = await Benevole.findOne({
      email
    });
    if (findBenevole) {
      return res.status(400).json({
        text: "Le benevole existe déjà"
      });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
  try {
    // Sauvegarde du benevole dans la base de données
    const benevoleData = new Member(benevole);
    const benevoleObject = await benevoleData.save();
    return res.status(200).json({ text: 'benevole inscrit dans la base !' });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function memberModif(req, res) {
  const { password, newPassword, email, newEmail, nom, partnerships, date_fin_abo, etablissement, memberEtablissement, memberToken } = req.body;
  let newEtablissement = etablissement;
  let finalEmail = email;
    //email et password non null
    if (!email || !password) {
      return res.status(400).json({
        text: "Requête invalide"
      });
    }
    if (!regexName.test(nom)) {
      return res.status(400).json({
        text: "Nom Invalide"
      });
    }
    if (!regexPassword.test(password) || !newPassword ) {
      return res.status(400).json({
        text: "Password Invalide"
      });
    }
  //vérification du token
  if (!memberToken) {
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  try {
    let mail = '';
    jwt.verify(memberToken, config.secret, function (err, decoded) {
      mail = decoded.email;
    });
    const findMember = await Member.findOne({ email: mail });
    if (!findMember)
        return res.status(401).json({
          text: "Token invalide !"
        });
      const findBenevole = await Benevole.findOne({ email });
      if (!findBenevole)
        return res.status(401).json({
          text: "Requête invalide !"
        });
      if (findMember.admin == false) {
        newEtablissement = await Benevole.findOne({ email }).etablissement;
      }
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
  // modification du benevole
  if (email != newEmail) {
    finalEmail = newEmail;
  }
  if (newPassword) {
    try {
      await Benevole.updateOne({ email: email }, {
        nom,
        email: finalEmail,
        partnerships,
        date_fin_abo,
        etablissement: newEtablissement,
        password: bcrypt.hashSync(password, 10)
      });
      return res.status(200).json({ text: 'benevole modifié dans la base !' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else {
    try {
      await Benevole.updateOne({ email: email }, {
        nom,
        email: finalEmail,
        partnerships,
        date_fin_abo,
        etablissement: newEtablissement
      });
      return res.status(200).json({ text: 'benevole modifié dans la base !' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

async function deleteBenevole(req, res) {
  const { email, memberEtablissement, memberToken } = req.body;
    //email et password non null
    if (!email || !memberEtablissement) {
      return res.status(400).json({
        text: "Requête invalide"
      });
    }
  //vérification du token
  if (!memberToken) {
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  try {
    let mail = '';
    jwt.verify(memberToken, config.secret, function (err, decoded) {
      mail = decoded.email;
    });
    const findMember = await Member.findOne({ email: mail });
    if (!findMember)
        return res.status(401).json({
          text: "Token invalide !"
        });
      const findBenevole = await Benevole.findOne({ email });
      if (!findBenevole)
        return res.status(401).json({
          text: "Requête invalide !"
        });
      if (!findMember.admin && findBenevole.etablissement != findMember.etablissement) {
        return res.status(401).json({
          text: "Requête invalide !"
        });
      }
      await Benevole.deleteOne({ email: email });
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
}

async function benevoleModif(req, res) {
  const { password, newPassword, email, newEmail, benevoleToken } = req.body;
  let newEtablissement = etablissement;
  let finalEmail = email;
  //email et password non null
  if (!email || !password) {
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  if (!regexPassword.test(password) || !newPassword ) {
    return res.status(400).json({
      text: "Password Invalide"
    });
  }
  //vérification du token
  if (!benevoleToken) {
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  try {
    let mail = '';
    jwt.verify(benevoleToken, config.secret, function (err, decoded) {
      mail = decoded.email;
    });
    const findBenevole = await Member.findOne({ email: mail });
      if (!findBenevole)
        return res.status(401).json({
          text: "Token invalide !"
        });
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
  // modification du benevole
  if (email != newEmail) {
    finalEmail = newEmail;
  }
  if (newPassword) {
    try {
      await Benevole.updateOne({ email: email }, {
        email: finalEmail,
        password: bcrypt.hashSync(password, 10)
      });
      return res.status(200).json({ text: 'benevole modifié dans la base !' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  } else {
    try {
      await Benevole.updateOne({ email: email }, {
        email: finalEmail
      });
      return res.status(200).json({ text: 'benevole modifié dans la base !' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

async function login(req, res) {
  const { password, email } = req.body;
  //email et password non null
  if (!email || !password) {
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  try {
    // verif dans la base si existant
    const findBenevole = await Benevole.findOne({ email });
    if (!findBenevole)
      return res.status(401).json({
        text: "Le benevole n'existe pas"
      });
    if (!bcrypt.compareSync(password, findBenevole.password))
      return res.status(401).json({
        text: "Mot de passe incorrect"
      });
    return res.status(200).json({ benevoleToken: jwt.sign({ email: findBenevole.email, name: findBenevole.name, _id: findBenevole.id, type: 'benevole' }, config.secret) });
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
}

async function info(req, res) {
  const { adminToken } = req.body;
  let data;
  //vérifie si le token est présent
  if (!adminToken) {
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  try {
    let mail = '';
    jwt.verify(adminToken, config.secret, function (err, decoded) {
      mail = decoded.email;
    });
    const findMember = await Member.findOne({ email: mail });
      if (!findMember)
        return res.status(401).json({
          text: "requête invalide !"
        });
      if (findMember.admin) {
        data = await Benevole.find({});
      } else {
        data = await Member.find({ etablissement: findMember.etablissement });
      }
      console.log(data)
    return res.status(200).json({ benevole: data });
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
}


//export
exports.login = login;
exports.register = register;
exports.info = info;
exports.memberModif = memberModif;
exports.benevoleModif = benevoleModif;
exports.deleteBenevole = deleteBenevole;