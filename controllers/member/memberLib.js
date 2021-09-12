const Member = require("../../models/memberModel.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("../../config/config");

const regexUsername = /^[a-z0-9_-]{3,16}$/g;
const regexPassword = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}))/g;
const regexName = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;

async function register(req, res) {
  const { password, email , name} = req.body;
  //email et password non null
  if (!email || !password) {
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  if (!regexName.test(name)) {
    return res.status(400).json({
      text: "Name Invalide"
    });
  }
  regexPassword.test(password);
  if (!regexPassword.test(password)) {
    return res.status(400).json({
      text: "Password Invalide"
    });
  }
  // hash du password
  const memeber = {
    name,
    email,
    password: bcrypt.hashSync(password, 10)
  };
  // verif dans la base si déjà existant
  try {
    const findMember = await Member.findOne({
      email
    });
    if (findMember) {
      return res.status(400).json({
        text: "Le memebre existe déjà"
      });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
  try {
    // Sauvegarde de user dans la base de données
    const memberData = new Member(memeber);
    const memeberObject = await memeberData.save();
    return res.status(200).json({memberToken: jwt.sign({email: memeber.email, name: memeber.name, _id: memeber.id, type: 'member'}, config.secret)});
  } catch (error) {
    return res.status(500).json({ error });
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
    const findMember = await Member.findOne({ email });
    if (!findMember)
      return res.status(401).json({
        text: "Le memebre n'existe pas"
      });
    if (!bcrypt.compareSync(password, findMember.password))
      return res.status(401).json({
        text: "Mot de passe incorrect"
      });
      
    return res.status(200).json({memberToken: jwt.sign({email: findMember.email, name: findMember.name, _id: findMember.id, type: 'member'}, config.secret), admin: findMember.admin});
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
}

async function info(req, res) {
  const { memberToken } = req.body;
  //vérifie si le token est présent
  if (!memberToken) { 
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  try {
    let findEmail = '';
    jwt.verify(memberToken, config.secret, function(err, decoded) {
      dataName = decoded.name;
      findEmail = decoded.email;
    });
    const findMember = await Member.findOne({ email: findEmail });
    if (!findMember)
      return res.status(401).json({
        text: "Le memebre n'existe pas"
      });
    const name = findMember.name;
    const email = findMember.email;
    return res.status(200).json({name, email});
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
}

async function info(req, res) {
  const { memberToken } = req.body;
  //vérifie si le token est présent
  if (!memberToken) { 
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  try {
    let findEmail = '';
    jwt.verify(memberToken, config.secret, function(err, decoded) {
      dataName = decoded.name;
      findEmail = decoded.email;
    });
    const findMember = await Member.findOne({ email: findEmail });
    if (!findMember)
      return res.status(401).json({
        text: "Le memebre n'existe pas"
      });
    const name = findMember.name;
    const email = findMember.email;
    return res.status(200).json({name, email});
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