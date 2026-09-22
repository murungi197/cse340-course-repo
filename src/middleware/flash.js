const flash = (request, response, next) => {
  request.flash = (type, message) => {
    request.session.flash = request.session.flash || {};

    if (message) {
      request.session.flash[type] = request.session.flash[type] || [];
      request.session.flash[type].push(message);
      return;
    }

    const messages = request.session.flash[type] || [];
    delete request.session.flash[type];
    return messages;
  };

  response.locals.flash = request.flash;
  next();
};

export default flash;
