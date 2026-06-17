const send = (res, responseData, data = {}) => {
    const { code, message } = responseData;
    return res.status(code).send({
      responseCode: code,
      responseMessage: message,
      responseData: data,
    });
  };
  
  const setErrResMsg = (res, parameter) => {
    return {
      code: res.code,
      message: `${parameter} ${res.message}`,
    };
  };
  
  export { send, setErrResMsg };