// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html

const { Schema } = require("mongoose");

// for more of what you can do here.
module.exports = function (app) {
  const modelName = "users";
  const mongooseClient = app.get("mongooseClient");
  const schema = new mongooseClient.Schema(
    {
      googleId: { type: String },
      facebookId: { type: String },
      firstName: { type: String, required: true, lowercase: true },
      lastName: { type: String, required: true, lowercase: true },
      deleted: { type: Boolean, default: false },
      phone: { type: Number, default: -1 },
      profilePhoto: {
        url: { type: String, default: "" },
        id: { type: String, default: "no_id_Oauth" },
      },
      gender: { type: String, enum: ["male", "female"] },
      email: { type: String, lowercase: true, unique: true },
      password: {
        type: String,
        require: true,
        default: process.env.DEFAULT_OAUTH_PASSWORD,
      },
      workAt: {
        role: { type: String },
        company: { type: String },
      },
      country: { type: String },
      followings: [{ type: Schema.Types.ObjectId, ref: "users" }],
      followers: [{ type: Schema.Types.ObjectId, ref: "users" }],
      isAdmin: { type: Boolean, require: true, default: false },
    },
    {
      timestamps: true,
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
