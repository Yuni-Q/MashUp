const express = require('express');
const passport = require('passport');

const {
  resultFormat,
} = require('../helpers/formHelper');
const {
  isLoggedIn,
  isNotLoggedIn,
} = require('../middlewares/passport/checkLogin');

const router = express.Router();

router.post('/login', isNotLoggedIn, (req, res, next) => {
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

router.delete('/login', isLoggedIn, async (req, res) => {
  try {
    await req.logout();
    await req.session.destroy();
  } catch (error) {
    res.json(resultFormat(400, error.message, null));
    return;
  }
  res.json(resultFormat(200, null, true));
});

module.exports = router;
