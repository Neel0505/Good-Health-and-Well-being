require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
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

    const adminEmail = 'admin@fittrack.local';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'FitTrack Admin',
        email: adminEmail,
        password: 'Admin@123',
        role: 'admin',
        fitnessGoal: 'General Fitness',
        activityLevel: 'Moderately Active',
      });
      console.log('Created admin user: admin@fittrack.local / Admin@123');
    } else if (admin.role !== 'admin') {
      admin.role = 'admin';
      await admin.save();
      console.log('Promoted existing admin@fittrack.local to admin');
    } else {
      console.log('Admin user already exists: admin@fittrack.local');
    }

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
