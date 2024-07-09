exports.user_sercure_get = (req, res, next) => {
  res.render("user_form");
};

exports.user_sercure_post = (req, res, next) => {
  const sercurePasswrod = "admin";
  if (req.body.secretPassword === sercurePasswrod) {
    res.redirect(
      "/catalog/" +
        req.params.model +
        "/" +
        req.params.id +
        "/" +
        req.params.action
    );
  } else {
    res.render("user_form");
  }
};
