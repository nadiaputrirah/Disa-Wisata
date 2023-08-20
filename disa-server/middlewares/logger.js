const log = (req, res, next) => {
  console.log(new Date().toLocaleDateString(), "=>", req.method, req.url);
  next();
};

module.exports = log;
