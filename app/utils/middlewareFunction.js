exports.sendError = function (err,res) {
  const errorMessage = err.customMessage;
  if (typeof err == 'object' && err.hasOwnProperty('statusCode') && err.hasOwnProperty('customMessage')) {
    return res.status(err.statusCode).send({statusCode: err.statusCode, message: errorMessage, type: err.type || ERROR.eng.DEFAULT.type });
  }
  else {
    return res.status(400).send({statusCode: 400 , message: errorMessage, type: err.type || ERROR.eng.DEFAULT.type });
  }
};

exports.sendSuccess = function (successMsg, data, res) {
    const message = successMsg.customMessage;
    if (typeof successMsg == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
        return res.status(successMsg.statusCode).send({statusCode:successMsg.statusCode, message: message, data: data || {}});
    }else {
        return res.status(200).send({statusCode:200, message: message, data: data || {}});

    }
};
