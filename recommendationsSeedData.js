// const mongoose = require("mongoose");
// const { Recommendation } = require("./models/Recommendation");
//
// console.log("Recommendations are ...");
//

const mongoose = require("mongoose");
const { Recommendation } = require("./models/Recommendation");
const config = require('config');

const db = config.get('db');
console.log("db", db);

mongoose.connect(db)
  .then(() => console.log(`Connected to db: ${db}`))
  .catch(() => console.log(`Unable to connect to db: ${db}`));

const seedData = [
  { keyword: "taco", type: "food" },
  { keyword: "tacos", type: "food" },
  { keyword: "chocolate", type: "food" },
  { keyword: "india", type: "destination" },
  { keyword: "indian", type: "food" },
  { keyword: "china", type: "destination" },
  { keyword: "chinese", type: "food" },
  { keyword: "pizza", type: "food" },
  { keyword: "sushi", type: "food"},
  { keyword: "burrito", type: "food" },
  { keyword: "mexico", type: "destination" },
  { keyword: "mexican", type: "food" },
  { keyword: "italy", type: "destination" },
  { keyword: "italian", type: "food" },
  { keyword: "disney", type: "destination" },
  { keyword: "disneyland", type: "destination" },
  { keyword: "universal studios", type: "destination"  },
  { keyword: "skydiving", type: "event" },
  { keyword: "french", type: "food" },
  { keyword: "france", type: "destination" },
  { keyword: "paris", type: "destination" },
  { keyword: "korea", type: "destination" },
  { keyword: "japan", type: "destination" },
  { keyword: "vietnam", type: "destination" },
  { keyword: "thailand", type: "destination" },
  {keyword: "cinema", type: "destination"},
  {keyword: "australia", type: "destination"},
  {keyword: "germany", type: "destination"},
  {keyword: "paris", type: "destination"},
  {keyword: "london", type: "destination"},
  {keyword: "area 51", type: "destination"},
  {keyword: "Hawaii", type: "destination"},
  {keyword: "Burger", type: "food"},
  {keyword: "Vegetarian", type: "food"},
  {keyword: "Fruit", type: "food"},
  {keyword: "Sandwich", type: "food"},
  {keyword: "sea food", type: "food"},
  {keyword: "crawfish", type: "food"},
  {keyword: "korean bbq", type: "food"},
  {keyword: "Surfing", type: "event"},
  {keyword: "Marathon", type: "event"},
  {keyword: "Snowboarding", type: "event"},
  {keyword: "Swimming", type: "event"},
  {keyword: "Tennis", type: "event"},
  {keyword: "Solar Eclipse", type: "event"},
  {keyword: "Scavenger Hunt", type: "event"},
];

Recommendation.insertMany(seedData, function(err, doc) {
  if (err) {
    console.error("unable to save");
  } else {
    console.log("successfully saved document", doc);
  }
});



//
// const recommendation = new Recommendation({
//   keyword: "California",
//   type: "destination"
// });
// const result = recommendation.save();
// result.then(res => {
//   console.log("res is ", res);
// }).catch(err => {
//   console.error("error is ", err);
// })
