const express = require('express');
const passport = require('passport');
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

router.post('/signUp', isNotLoggedIn, async (req, res) => {
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
    res.json(resultFormat(200, null, true));
    return;
  } catch (error) {
    res.json(resultFormat(400, error.message, null));
  }
});

router.delete('/signUp', isLoggedIn, async (req, res) => {
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
    res.json(resultFormat(400, error.message, null));
  }
  res.json(resultFormat(200, null, true));
});


router.post('/', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) next(authError);
    if (!user) {
      res.json(resultFormat(400, info.message, null));
      return;
    }
    req.login(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      return res.json(resultFormat(200, null, true));
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.delete('/', isLoggedIn, async (req, res) => {
  try {
    await req.logout();
    await req.session.destroy();
  } catch (error) {
    res.json(resultFormat(400, error.message, null));
    return;
  }
  res.json(resultFormat(200, null, true));
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
      res.json(resultFormat(400, '유저가 존재하지 않습니다.', null));
    }
  } catch (error) {
    res.json(resultFormat(400, error.message, null));
  }
  res.json(resultFormat(200, null, true));
});

module.exports = router;
