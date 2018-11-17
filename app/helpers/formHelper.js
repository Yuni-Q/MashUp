module.exports = {
  resultFormat: (status, message, result) => {
    console.log(message);
    return {
      status,
      error: message,
      result,
    };
  },
};
