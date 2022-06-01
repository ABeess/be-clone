/* eslint-disable no-unused-vars */
const multer = require("multer");
const cloudinary = require("../../middleware/cloudinary");

exports.Upload = class Upload {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {
    return {
      id,
      text: `A new message with ID: ${id}!`,
    };
  }

  async create(data, params) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      params.file.path
    );
    return { url: secure_url, id: public_id };
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
