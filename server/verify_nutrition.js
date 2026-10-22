require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  console.log('DB=' + db.databaseName);

  const cols = await db.listCollections().toArray();
  for (const c of cols.sort((a, b) => a.name.localeCompare(b.name))) {
    const n = await db.collection(c.name).countDocuments();
    console.log('TABLE', c.name, '=>', n);
  }

  console.log('\nFOOD SAMPLE:');
  const foods = await db
    .collection('foods')
    .find({ name: { $in: ['Paneer', 'Chicken Breast', 'Banana', 'Egg'] } })
    .project({ name: 1, servingSize: 1, servingUnit: 1, calories: 1, protein: 1 })
    .toArray();
  foods.forEach((f) =>
    console.log(
      JSON.stringify({
        name: f.name,
        serving: `${f.servingSize}${f.servingUnit}`,
        cal: f.calories,
        protein: f.protein,
      })
    )
  );

  console.log('\nFOOD LOGS + VERIFICATION:');
  const logs = await db
    .collection('foodlogs')
    .aggregate([
      { $lookup: { from: 'foods', localField: 'foodId', foreignField: '_id', as: 'food' } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $sort: { createdAt: -1 } },
    ])
    .toArray();

  logs.forEach((l) => {
    const food = l.food[0] || {};
    const user = l.user[0] || {};
    const factor = food.servingSize ? l.quantity / food.servingSize : null;
    const expectedCal = factor != null ? Math.round(food.calories * factor * 10) / 10 : null;
    const expectedP = factor != null ? Math.round(food.protein * factor * 10) / 10 : null;
    console.log(
      JSON.stringify({
        user: user.email,
        meal: l.mealType,
        food: food.name,
        qty: l.quantity,
        catalogCal: food.calories,
        catalogP: food.protein,
        serving: food.servingSize,
        storedCal: l.calories,
        storedP: l.protein,
        expectedCal,
        expectedP,
        match: expectedCal === l.calories && expectedP === l.protein,
      })
    );
  });

  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
