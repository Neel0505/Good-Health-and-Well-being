require('dotenv').config({ path: require('path').join(__dirname, '..', 'server', '.env') });
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await mongoose.connection.db
    .collection('users')
    .find({}, { projection: { name: 1, email: 1 } })
    .toArray();

  console.log('USERS:');
  users.forEach((u) => console.log('-', u.name, '|', u.email));

  const logs = await mongoose.connection.db
    .collection('foodlogs')
    .aggregate([
      { $lookup: { from: 'foods', localField: 'foodId', foreignField: '_id', as: 'food' } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
      { $sort: { createdAt: -1 } },
      { $limit: 20 },
    ])
    .toArray();

  console.log('\nFOOD LOGS (latest):');
  if (!logs.length) console.log('(none yet)');
  logs.forEach((l) => {
    const food = (l.food[0] && l.food[0].name) || '?';
    const user = (l.user[0] && l.user[0].email) || '?';
    console.log(
      '-',
      user,
      '|',
      l.mealType,
      '|',
      food,
      '| qty',
      l.quantity,
      '|',
      l.calories + ' kcal',
      '|',
      new Date(l.date).toISOString().slice(0, 10)
    );
  });

  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
