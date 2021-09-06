const User = require("../../models/userModel.js");
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
  const user = {
    name,
    email,
    password: bcrypt.hashSync(password, 10)
  };
  // verif dans la base si déjà existant
  try {
    const findUser = await User.findOne({
      email
    });
    if (findUser) {
      return res.status(400).json({
        text: "L'utilisateur existe déjà"
      });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
  try {
    // Sauvegarde de user dans la base de données
    const userData = new User(user);
    const userObject = await userData.save();
    return res.status(200).json({token: jwt.sign({email: user.email, name: user.name, _id: user.id}, config.secret)});
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
    const findUser = await User.findOne({ email });
    if (!findUser)
      return res.status(401).json({
        text: "L'utilisateur n'existe pas"
      });
    if (!bcrypt.compareSync(password, findUser.password))
      return res.status(401).json({
        text: "Mot de passe incorrect"
      });
    return res.status(200).json({token: jwt.sign({email: findUser.email, name: findUser.name, _id: findUser.id}, config.secret)});
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
}

const loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({message: 'Unauthorized user !'});
    }
}

async function infoUser(req, res) {
  const { token } = req.body;
  //vérifie si le token est présent
  if (!token) { 
    return res.status(400).json({
      text: "Requête invalide"
    });
  }
  try {
    let findEmail = '';
    jwt.verify(token, config.secret, function(err, decoded) {
      dataName = decoded.name;
      findEmail = decoded.email;
    });
    const findUser = await User.findOne({ email: findEmail });
    if (!findUser)
      return res.status(401).json({
        text: "L'utilisateur n'existe pas"
      });
    const name = findUser.name;
    const email = findUser.email;
    return res.status(200).json({name, email});
  } catch (error) {
    return res.status(500).json({
      error
    });
  }
}



async function test(req, res) {
  return res.status(200).json({test: "ok"});
}

//export
exports.login = login;
exports.register = register;
exports.loginRequired = loginRequired;
exports.infoUser = infoUser;



exports.test = test;