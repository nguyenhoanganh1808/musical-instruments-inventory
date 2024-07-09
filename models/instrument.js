const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InstrumentSchema = new Schema({
  name: { type: String, require: true, maxLength: 100 },
  description: { type: String, require: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category", require: true }],
  price: { type: Number, require: true, min: 1 },
  number_in_stock: { type: Number, require: true, min: 1 },
  image: { type: String },
});

InstrumentSchema.virtual("url").get(function () {
  return `/catalog/instrument/${this._id}`;
});

InstrumentSchema.virtual("price_formated").get(function () {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(this.price);
});

module.exports = mongoose.model("Instrument", InstrumentSchema);
