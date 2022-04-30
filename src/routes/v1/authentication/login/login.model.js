import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    createUid: {
      type: String,
      default: null,
    },
    writeUid: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
    deleteId: {
      type: String,
      default: null,
    },

    last_name: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { collection: "user", timestamps: true }
);

UserSchema.pre("find", function () {
  this.where({ status: { $ne: false } });
});
UserSchema.pre("findById", function () {
  this.where({ status: { $ne: false } });
});
UserSchema.pre("findOne", function () {
  this.where({ status: { $ne: false } });
});
UserSchema.pre("countDocuments", function () {
  this.where({ status: { $ne: false } });
});
UserSchema.pre("aggregate", function () {
  this.pipeline().unshift({ $match: { status: { $ne: false } } });
});

export default mongoose.model("user", UserSchema);
