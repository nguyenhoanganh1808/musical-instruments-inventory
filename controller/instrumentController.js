const { populate } = require("../models/category");
const Instrument = require("../models/instrument");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const helper = require("../helper/helper");

// Require the cloudinary library

//display list of instrument
exports.instrument_list = asyncHandler(async (req, res, next) => {
  const allInstruments = await Instrument.find({}).sort({ name: 1 }).exec();

  res.render("instrument_list", {
    title: "Instrument List",
    instrument_list: allInstruments,
  });
});

//display detail for instrument
exports.instrument_detail = asyncHandler(async (req, res, next) => {
  const instrument = await Instrument.findById(req.params.id)
    .populate("category")
    .exec();

  if (instrument === null) {
    const err = new Error("Instrument not found");
    err.status = 404;
    return next(err);
  }

  res.render("instrument_detail", {
    title: "Instrument Detail",
    instrument: instrument,
  });
});

//display create get form
exports.instrument_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).sort({ name: 1 }).exec();
  res.render("instrument_form", {
    title: "Create instrument",
    category_list: allCategories,
  });
});

//handle create form on post
exports.instrument_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },
  body("name", "Instrument name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price")
    .trim()
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 1 })
    .withMessage("Price must greater than 1")
    .escape(),
  body("number_in_stock")
    .trim()
    .isNumeric()
    .withMessage("Number must be a number")
    .isFloat({ min: 1 })
    .withMessage("Number must greater than 1")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Description must not be empty.")
    .escape(),
  body("category.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const imageUrl = await helper.uploadImage(req.file.path);
    const instrument = new Instrument({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      number_in_stock: req.body.number_in_stock,
      price: req.body.price,
      image: imageUrl,
    });
    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}).sort({ name: 1 }).exec();

      for (const category of allCategories) {
        if (instrument.category.indexOf(category._id) > -1) {
          category.checked = "true";
        }
      }

      res.render("instrument_form", {
        title: "Create instrument",
        category_list: allCategories,
        instrument: instrument,
        errors: errors.array(),
      });
      return;
    } else {
      await instrument.save();
      res.redirect(instrument.url);
    }
  }),
];

exports.instrument_update_get = asyncHandler(async (req, res, next) => {
  const [instrument, allCategories] = await Promise.all([
    Instrument.findById(req.params.id).exec(),
    Category.find({}).sort({ name: 1 }).exec(),
  ]);

  if (instrument === null) {
    const err = new Error("Instrument not found");
    err.status = 404;
    return next(err);
  }

  allCategories.forEach((category) => {
    if (instrument.category.includes(category._id)) {
      category.checked = true;
    }
  });

  res.render("instrument_form", {
    title: "Update instrument",
    instrument: instrument,
    category_list: allCategories,
  });
});

exports.instrument_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },
  body("name", "Instrument name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price")
    .trim()
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 1 })
    .withMessage("Price must greater than 1")
    .escape(),
  body("number_in_stock")
    .trim()
    .isNumeric()
    .withMessage("Number must be a number")
    .isFloat({ min: 1 })
    .withMessage("Number must greater than 1")
    .escape(),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Description must not be empty.")
    .escape(),
  body("category.*").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const imageUrl = await helper.uploadImage(req.file.path);

    const instrument = new Instrument({
      image: imageUrl === "undefined" ? null : imageUrl,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category:
        typeof "undefined" === req.body.category ? [] : req.body.category,
      number_in_stock: req.body.number_in_stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}).sort({ name: 1 }).exec();

      allCategories.forEach((category) => {
        if (instrument.category.includes(category._id)) {
          category.checked = true;
        }
      });

      res.render("instrument_form", {
        title: "Update instrument",
        instrument: instrument,
        category_list: allCategories,
        errors: errors.array(),
      });
      return;
    }

    await Instrument.findByIdAndUpdate(req.params.id, instrument, {});
    res.redirect(instrument.url);
  }),
];

exports.instrument_delete_get = asyncHandler(async (req, res, next) => {
  const instrument = await Instrument.findById(req.params.id);

  if (instrument === null) {
    const err = new Error("Instrument not found");
    err.status = 404;
    return next(err);
  }

  res.render("instrument_delete", {
    title: "Delete instrument",
    instrument: instrument,
  });
});

exports.instrument_delete_post = asyncHandler(async (req, res, next) => {
  await Instrument.findByIdAndDelete(req.body.instrumentid);
  res.redirect("/catalog/instruments");
});
