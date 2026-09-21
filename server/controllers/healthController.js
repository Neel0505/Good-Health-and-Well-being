const { body } = require('express-validator');
const HealthLog = require('../models/HealthLog');
const AppError = require('../utils/AppError');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { parseDateParam, startOfDay, endOfDay } = require('../utils/nutrition');

const healthValidators = [
  body('date').optional().isISO8601().withMessage('Invalid date'),
  body('water').optional().isFloat({ min: 0, max: 20000 }).withMessage('Water must be 0–20000 ml'),
  body('sleep').optional().isFloat({ min: 0, max: 24 }).withMessage('Sleep must be 0–24 hours'),
  body('weight').optional({ nullable: true }).isFloat({ min: 20, max: 500 }).withMessage('Weight must be 20–500 kg'),
  body('notes').optional().isLength({ max: 300 }),
];

const getHealthLogs = asyncHandler(async (req, res) => {
  const { from, to, date } = req.query;
  const filter = { userId: req.user._id };

  if (date) {
    const day = parseDateParam(date);
    if (!day) throw new AppError('Invalid date', 400);
    filter.date = { $gte: day, $lte: endOfDay(day) };
  } else if (from || to) {
    filter.date = {};
    if (from) {
      const start = parseDateParam(from);
      if (!start) throw new AppError('Invalid from date', 400);
      filter.date.$gte = start;
    }
    if (to) {
      const end = parseDateParam(to);
      if (!end) throw new AppError('Invalid to date', 400);
      filter.date.$lte = endOfDay(end);
    }
  }

  const logs = await HealthLog.find(filter).sort({ date: -1 });
  res.json({ success: true, data: { logs } });
});

const upsertHealthLog = asyncHandler(async (req, res) => {
  const day = req.body.date ? parseDateParam(req.body.date) : startOfDay();
  if (!day) throw new AppError('Invalid date', 400);

  const payload = {
    water: req.body.water ?? 0,
    sleep: req.body.sleep ?? 0,
    notes: req.body.notes || '',
  };

  if (req.body.weight !== undefined && req.body.weight !== null && req.body.weight !== '') {
    payload.weight = Number(req.body.weight);
  }

  let log = await HealthLog.findOne({ userId: req.user._id, date: day });

  if (log) {
    Object.assign(log, payload);
    if (req.body.weight === null || req.body.weight === '') {
      log.weight = undefined;
    }
    await log.save();
  } else {
    log = await HealthLog.create({
      userId: req.user._id,
      date: day,
      ...payload,
    });
  }

  // Keep profile weight in sync when user logs weight
  if (payload.weight) {
    req.user.weight = payload.weight;
    await req.user.save();
  }

  res.status(201).json({ success: true, data: { log } });
});

const updateHealthLog = asyncHandler(async (req, res) => {
  const log = await HealthLog.findById(req.params.id);
  if (!log) throw new AppError('Health log not found', 404);
  if (String(log.userId) !== String(req.user._id)) {
    throw new AppError('Not authorized', 403);
  }

  ['water', 'sleep', 'notes'].forEach((field) => {
    if (req.body[field] !== undefined) log[field] = req.body[field];
  });

  if (req.body.weight !== undefined) {
    if (req.body.weight === null || req.body.weight === '') {
      log.weight = undefined;
    } else {
      log.weight = Number(req.body.weight);
      req.user.weight = log.weight;
      await req.user.save();
    }
  }

  await log.save();
  res.json({ success: true, data: { log } });
});

const deleteHealthLog = asyncHandler(async (req, res) => {
  const log = await HealthLog.findById(req.params.id);
  if (!log) throw new AppError('Health log not found', 404);
  if (String(log.userId) !== String(req.user._id)) {
    throw new AppError('Not authorized', 403);
  }

  await log.deleteOne();
  res.json({ success: true, data: { message: 'Health log deleted' } });
});

module.exports = {
  getHealthLogs,
  upsertHealthLog,
  updateHealthLog,
  deleteHealthLog,
  healthValidators,
};
