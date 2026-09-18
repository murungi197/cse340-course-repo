const showHomePage = async (request, response) => {
  response.render("home", { title: "Home", page: "home" });
};

export { showHomePage };
