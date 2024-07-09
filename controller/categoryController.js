const Category = require("../models/category");
const Instrument = require("../models/instrument");
const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");

//display list of category
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, "name")
    .sort({ name: 1 })
    .exec();
  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
  });
});

//display detail for category
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [allInstrumentsInCategory, category] = await Promise.all([
    Instrument.find({ category: req.params.id }).sort({ name: 1 }).exec(),
    Category.findById(req.params.id),
  ]);

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("instrument_list", {
    title: "Category Detail",
    category: category,
    instrument_list: allInstrumentsInCategory,
  });
});

//display create get form
exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};

//handle create form on post
exports.category_create_post = [
  body("name", "Category name must be at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExist = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (categoryExist) {
        res.redirect(categoryExist.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

exports.category_update_get = [
  asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();
    if (category === null) {
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }

    res.render("category_form", {
      title: "Update Category",
      category: category,
    });
  }),
];

exports.category_update_post = [
  body("name", "Category name must contain atleast 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExist = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (categoryExist) {
        res.redirect(categoryExist.url);
      } else {
        await Category.findByIdAndUpdate(req.params.id, category, {});
        res.redirect(category.url);
      }
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, allInstrumentsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Instrument.find({ category: req.params.id }).sort({ name: 1 }).exec(),
  ]);

  if (category === null) {
    res.redirect("/catalog/categories");
  }

  res.render("category_delete", {
    title: "Delete category",
    category: category,
    instrument_list: allInstrumentsInCategory,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, allInstrumentsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Instrument.find({ category: req.params.id }).sort({ name: 1 }).exec(),
  ]);

  if (allInstrumentsInCategory.length > 0) {
    res.render("category_delete", {
      title: "Delete category",
      category: category,
      instrument_list: allInstrumentsInCategory,
    });
    return;
  }
  await Category.findByIdAndDelete(req.body.categoryid);
  res.redirect("/catalog/categories");
});
