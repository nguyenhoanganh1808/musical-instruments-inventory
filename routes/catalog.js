const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const category_controller = require("../controller/categoryController");
const user_controller = require("../controller/userController");
const instrument_controller = require("../controller/instrumentController");

/// CATEGORY ROUTE ///

//get catalog home page
// router.get("/", category_controller.index);

//create form
router.get("/category/create", category_controller.category_create_get);

router.post("/category/create", category_controller.category_create_post);

//delete form
router.get("/category/:id/delete", category_controller.category_delete_get);

router.post("/category/:id/delete", category_controller.category_delete_post);

//update form
router.get("/category/:id/update", category_controller.category_update_get);

router.post("/category/:id/update", category_controller.category_update_post);

//get for one category
router.get("/category/:id", category_controller.category_detail);

//get for list category
router.get("/categories", category_controller.category_list);

///INSTRUMENT ROUTE

//create form
router.get("/instrument/create", instrument_controller.instrument_create_get);

router.post(
  "/instrument/create",
  upload.single("image"),
  instrument_controller.instrument_create_post
);

//delete form
router.get(
  "/instrument/:id/delete",
  instrument_controller.instrument_delete_get
);

router.post(
  "/instrument/:id/delete",
  instrument_controller.instrument_delete_post
);

//update form
router.get(
  "/instrument/:id/update",
  instrument_controller.instrument_update_get
);

router.post(
  "/instrument/:id/update",
  upload.single("image"),
  instrument_controller.instrument_update_post
);

//get for one instrument
router.get("/instrument/:id", instrument_controller.instrument_detail);

//get for list instrument
router.get("/instruments", instrument_controller.instrument_list);

///USER
router.get("/:model/:id/:action/sercure", user_controller.user_sercure_get);

router.post("/:model/:id/:action/sercure", user_controller.user_sercure_post);

module.exports = router;
