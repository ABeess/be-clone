// Initializes the `upload` service on path `/upload`
const { Upload } = require("./upload.class");
const hooks = require("./upload.hooks");
const multer = require("multer");
const multipartMiddleware = multer({ storage: multer.diskStorage({}) });
module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use(
    "/upload",
    multipartMiddleware.single("file"),
    function (req, res, next) {
      req.feathers.file = req.file;
      next();
    },
    new Upload(options, app)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service("upload");

  service.hooks(hooks);
};
