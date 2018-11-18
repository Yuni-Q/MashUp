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

const router = express.Router();

router.post('/', isNotLoggedIn, async (req, res) => {
  const {
    userName,
    password,
  } = req.body;
  try {
    const exUsers = await Users.findOne({
      where: {
        userName,
      },
    });
    if (exUsers) {
      res.json(resultFormat(400, '이미 가입 된 유저 name 입니다.'));
      return;
    }
    const pwd = await crypto.makePssword(password);
    await Users.create({
      userName,
      password: pwd,
    });
    res.json(resultFormat(true, null));
    return;
  } catch (error) {
    res.json(resultFormat(false, error.message));
  }
});

router.put('/', isLoggedIn, async (req, res) => {
  const {
    userName,
    password,
    prePassword,
  } = req.body;
  try {
    const prePwd = await crypto.makePssword(prePassword);
    const pwd = await crypto.makePssword(password);
    const result = await Users.create({
      userName,
      password: prePwd,
    });
    if (result) {
      await Users.update({
        password: pwd,
      }, {
        where: {
          userName,
          password: prePwd,
        },
      });
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
    await Users.update({
      isDelete: true,
    }, {
      where: {
        id,
      },
    });
    await req.session.destroy();
  } catch (error) {
    res.json(resultFormat(false, error.message));
  }
  res.json(resultFormat(true, null));
});

module.exports = router;
