// responseUtil.js
const sendResponse = (res, statusCode, success, message, data = null) => {
    const response = {
      success,
      message,
      data
    };
  
    res.status(statusCode).json(response);
  };
  
  module.exports = sendResponse;
  