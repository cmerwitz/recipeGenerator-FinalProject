const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Home page
router.get('/', (req, res) => {
  res.render('index');
});

// Spin route — calls MealDB API
router.get('/spin', async (req, res) => {
  const category = req.query.category;

  try {
    let url;

    if (category) {
      // Step 1: get a list of meals in that category
      const listRes = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      const listData = await listRes.json();
      const meals = listData.meals;

      // Step 2: pick a random one from the list
      const randomMeal = meals[Math.floor(Math.random() * meals.length)];

      // Step 3: fetch the full details using its ID
      const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomMeal.idMeal}`);
      const detailData = await detailRes.json();

      res.render('result', { meal: detailData.meals[0] });

    } else {
      // No category — fetch a completely random meal
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();

      res.render('result', { meal: data.meals[0] });
    }

  } catch (err) {
    console.error(err);
    res.send('Something went wrong. Try spinning again!');
  }
});

module.exports = router;