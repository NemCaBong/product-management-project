const mongoose = require("mongoose");

const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    product_category_id: {
      type: String,
      default: "",
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    featured: String,
    position: Number,
    createdBy: {
      account_id: String,
      createdAt: Date,
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
    deleted: {
      type: Boolean,
      default: false,
    },

    updatedBy: [
      {
        account_id: String,
        updatedAt: Date,
      },
    ],
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
