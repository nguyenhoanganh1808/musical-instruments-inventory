#! /usr/bin/env node

console.log(
  'This script populates some category, instrusment to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Intrusment = require("./models/instrument");

const categories = [];
const instruments = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createIntruments();

  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description) {
  const category = new Category({ name: name, description: description });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function instrusmentCreate(
  index,
  name,
  description,
  category,
  price,
  number_in_stock
) {
  const instrument = new Intrusment({
    name: name,
    description: description,
    category: category,
    price: price,
    number_in_stock: number_in_stock,
  });

  await instrument.save();
  instruments[index] = instrument;
  console.log(`Added instrument: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "String",
      "Instruments that produce sound through vibrating strings, which can be played by plucking, strumming, or using a bow."
    ),
    categoryCreate(
      1,
      "Keyboard",
      "Instruments that produce sound through pressing keys on a keyboard, which may mechanically strike strings, reeds, or generate electronic tones."
    ),
    categoryCreate(
      2,
      "Percussion",
      "Instruments that produce sound by being struck, shaken, or scraped, and can be classified into tuned (pitched) and untuned (unpitched) categories."
    ),
    categoryCreate(
      3,
      "Brass",
      "Wind instruments made of brass or other metal, where sound is produced by vibrating lips against a mouthpiece and altering pitch using valves or a slide."
    ),
    categoryCreate(
      4,
      "Woodwind",
      "Wind instruments where sound is produced by blowing air through a reed or across an opening, with pitch altered by covering holes along the instrument's body."
    ),
    categoryCreate(
      5,
      "Electronic",
      "Instruments that generate sound electronically or amplify sound using electronic means, often featuring various sound effects and synthesis capabilities."
    ),
  ]);
}

async function createIntruments() {
  console.log("Adding Instrument");
  await Promise.all([
    instrusmentCreate(
      0,
      "Guitar (Acoustic)",
      "A versatile instrument with six strings, often used in a variety of music genres. It produces sound acoustically through its hollow body.",
      [categories[0]],
      1500,
      100
    ),
    instrusmentCreate(
      1,
      "Violin",
      "A four-stringed instrument played with a bow, known for its use in classical music, orchestras, and ensembles.",
      [categories[0]],
      3000,
      200
    ),
    instrusmentCreate(
      2,
      "Piano",
      "A large keyboard instrument that produces sound by striking strings with hammers, widely used in classical, jazz, and popular music.",
      [categories[1]],
      20000,
      1000
    ),
    instrusmentCreate(
      3,
      "Drum Kit",
      "A collection of drums and cymbals arranged for a single player, commonly used in rock, jazz, and pop music.",
      [categories[2]],
      2500,
      120
    ),
    instrusmentCreate(
      4,
      "Trumpet",
      " A brass instrument with a bright, powerful sound, used in classical, jazz, and marching band music",
      [categories[3]],
      2000,
      400
    ),
    instrusmentCreate(
      5,
      "Saxophone",
      "A woodwind instrument with a distinctive, rich sound, popular in jazz, classical, and contemporary music.",
      [categories[4]],
      3500,
      600
    ),
    instrusmentCreate(
      6,
      "Electric Guitar",
      " A guitar that uses pickups to convert string vibrations into electrical signals, amplified through speakers.",
      [categories[0], categories[5]],
      2500,
      4000
    ),
  ]);
}
