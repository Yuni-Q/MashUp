
const passport = require('passport');
const {
  resultFormat,
} = require('../helpers/formHelper');

module.exports = {
  login: (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
      if (authError) next(authError);
      if (!user) {
        res.json(resultFormat(false, info.message));
      }
      req.login(user, (loginError) => {
        if (loginError) {
          next(loginError);
        }
        res.json(resultFormat(true, null));
      });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
  },

  logout: async (req, res) => {
    try {
      await req.logout();
      await req.session.destroy();
    } catch (error) {
      res.json(resultFormat(false, error.message));
    }
    res.json(resultFormat(true, null));
  },
};
