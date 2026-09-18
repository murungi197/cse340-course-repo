const testErrorPage = (request, response, next) => {
  const error = new Error("This is a test error");
  error.status = 500;
  next(error);
};

export { testErrorPage };
