module.exports = {
  resultFormat: (ok, message, result = null) => {
    console.log(message);
    return {
      ok,
      error: message,
      result,
    };
  },
};
