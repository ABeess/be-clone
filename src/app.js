const path = require("path");
const favicon = require("serve-favicon");
const compress = require("compression");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const logger = require("./logger");

const feathers = require("@feathersjs/feathers");
const configuration = require("@feathersjs/configuration");
const express = require("@feathersjs/express");
const redis = require("redis");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { expressOauth } = require("@feathersjs/authentication-oauth");
const RedisStore = require("connect-redis")(session);
const redisClient = redis.createClient();
const middleware = require("./middleware");
const services = require("./services");
const appHooks = require("./app.hooks");
const channels = require("./channels");

const authentication = require("./authentication");

const mongoose = require("./mongoose");
const app = express(feathers());
// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(
  cors({
    origin: [
      "http://localhost:3039",
      "http://localhost:3034",
      process.env.SECRET_FRONTEND_DOMAIN,
    ],
    allowedHeaders: [
      "Content-Type",
      "Origin",
      "X-Requested-With",
      "Accept",
      "Authorization",
    ],
    credentials: true,
  })
);
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get("public"), "favicon.ico")));
// Host the public folder
app.use("/", express.static(app.get("public")));

// Set up Plugins and providers
app.configure(express.rest());

app.configure(mongoose);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
app.configure(
  expressOauth({
    expressSession: session({
      store: new RedisStore({ client: redisClient }),
      secret: "sdfsdfasfsdaf",
      resave: false,
      saveUninitialized: false,
    }),
  })
);
//Parse cookie
app.use(cookieParser("process.env.SECRET_SIGNED_COOKIES_CODE"));
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
