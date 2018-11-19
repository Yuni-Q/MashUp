const express = require('express');
const crypto = require('../helpers/cryptoHelper');
const {
  Users,
} = require('../models');

const {
  resultFormat,
} = require('../helpers/formHelper');
const {
  isLoggedIn,
  isNotLoggedIn,
} = require('../middlewares/passport/checkLogin');
const usersServices = require('../Services/usersServices');

const router = express.Router();

router.post('/', isNotLoggedIn, async (req, res) => {
  try {
    const exUsers = await usersServices.usersFindOneUserName(req.body);
    if (exUsers) {
      res.json(resultFormat(400, '이미 가입 된 유저 name 입니다.'));
      return;
    }
    await usersServices.createUser(req.body);
    res.json(resultFormat(true, null));
    return;
  } catch (error) {
    res.json(resultFormat(false, error.message));
  }
});

router.put('/', isLoggedIn, async (req, res) => {
  try {
    const result = await usersServices.checkUser(req.body);
    if (result) {
      await usersServices.updateUser(req.body);
    } else {
      res.json(resultFormat(false, '유저가 존재하지 않습니다.'));
    }
  } catch (error) {
    res.json(resultFormat(false, error.message));
  }
  res.json(resultFormat(true, null));
});

router.delete('/', isLoggedIn, async (req, res) => {
  const {
    id,
  } = req.user;
  try {
    await usersServices.deleteUser(req.body);
  } catch (error) {
    res.json(resultFormat(false, error.message));
  }
  res.json(resultFormat(true, null));
});

module.exports = router;
