const express = require('express');
const router = express.Router();
const SavedRecipe = require('../models/SavedRecipe');

// Show all saved recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await SavedRecipe.find().sort({ savedAt: -1 });
    res.render('saved', { recipes });
  } catch (err) {
    console.error(err);
    res.send('Error loading saved recipes.');
  }
});

// Save a recipe
router.post('/add', async (req, res) => {
  try {
    const { mealId, title, image, category } = req.body;

    // Check if already saved so you don't get duplicates
    const existing = await SavedRecipe.findOne({ mealId });
    if (!existing) {
      const recipe = new SavedRecipe({ mealId, title, image, category });
      await recipe.save();
    }

    res.redirect('/saved');
  } catch (err) {
    console.error(err);
    res.send('Error saving recipe.');
  }
});

// Delete a recipe
router.post('/delete/:id', async (req, res) => {
  try {
    await SavedRecipe.findByIdAndDelete(req.params.id);
    res.redirect('/saved');
  } catch (err) {
    console.error(err);
    res.send('Error deleting recipe.');
  }
});

module.exports = router;