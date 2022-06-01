// course-list-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = "courseList";
  const mongooseClient = app.get("mongooseClient");
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      title: { type: String, required: true },
      subTitle: { type: String, required: true },
      category: {
        type: Schema.Types.ObjectId,
        ref: "course-category",
        required: true,
      },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      description: { type: String, required: true },
      thumbnail: {
        url: { type: String, default: "af" },
        id: { type: String, default: "af" },
      },
      level: {
        type: String,
        enum: {
          values: ["Beginner", "Skilled", "Proficient", "Advanced"],
          message: "{VALUE} level is not supported",
        },
        required: true,
      },
      requirement: { type: String, required: true },
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
