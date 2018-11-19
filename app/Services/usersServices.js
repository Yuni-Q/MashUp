
const {
  resultFormat,
} = require('../helpers/formHelper');
const {
  Users,
} = require('../models');
const crypto = require('../helpers/cryptoHelper');

module.exports = {

  usersFindOneUserName: ({ userName }) => {
    return Users.findOne({
      where: {
        userName,
      },
    });
  },

  createUser: async ({ userName, password }) => {
    const pwd = await crypto.makePssword(password);
    return Users.create({
      userName,
      password: pwd,
    });
  },

  checkUser: async ({ prePassword, password, userName }) => {
    const prePwd = await crypto.makePssword(prePassword);
    const pwd = await crypto.makePssword(password);
    const result = await Users.create({
      userName,
      password: prePwd,
    });
    return result;
  },

  updateUser: async ({ prePassword, password, userName }) => {
    const prePwd = await crypto.makePssword(prePassword);
    const pwd = await crypto.makePssword(password);
    return Users.update({
      password: pwd,
    }, {
        where: {
          userName,
          password: prePwd,
        },
      });
  },

  deleteUser: async ({ id }) => {
    await Users.update({
      isDelete: true,
    }, {
        where: {
          id,
        },
      });
    return req.session.destroy();
  },
}