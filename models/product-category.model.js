const mongoose = require("mongoose");

const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema(
  {
    title: String,
    parent_id: {
      type: String,
      default: "",
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    deletedAt: Date,
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date,
      },
    ],
    createdBy: {
      account_id: String,
      createdAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

const ProductCategory = mongoose.model(
  "ProductCategory",
  productCategorySchema,
  "product-category"
);

module.exports = ProductCategory;
