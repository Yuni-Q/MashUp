const express = require('express');
const loginServices = require('../Services/loginServices');

const {
  resultFormat,
} = require('../helpers/formHelper');
const {
  isLoggedIn,
  isNotLoggedIn,
} = require('../middlewares/passport/checkLogin');

const router = express.Router();

router.post('/login', isNotLoggedIn, (req, res, next) => {
  loginServices.login(req, res, next)
});

router.delete('/login', isLoggedIn, async (req, res) => {
  loginServices.logout(req, res, next)
});

module.exports = router;
