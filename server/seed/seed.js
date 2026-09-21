require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Food = require('../models/Food');
const Exercise = require('../models/Exercise');
const foods = require('./foods');
const exercises = require('./exercises');

const seed = async () => {
  try {
    await connectDB();

    await Food.deleteMany({ isCustom: false });
    await Exercise.deleteMany({});

    const insertedFoods = await Food.insertMany(
      foods.map((f) => ({ ...f, isCustom: false, createdBy: null }))
    );
    const insertedExercises = await Exercise.insertMany(exercises);

    console.log(`Seeded ${insertedFoods.length} foods`);
    console.log(`Seeded ${insertedExercises.length} exercises`);
    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
