const User = require("../../models/userModel.js");
const Member = require("../../models/memberModel.js");
const Benevole = require("../../models/benevoleModel.js");
const ModelDev = require("../../models/greenAreaModel.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("../../config/config");

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