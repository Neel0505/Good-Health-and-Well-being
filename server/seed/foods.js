// Approximate values per listed serving — educational estimates only
const foods = [
  // Protein
  { name: 'Egg', category: 'Protein', servingSize: 50, servingUnit: 'g', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3 },
  { name: 'Chicken Breast', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Chicken Thigh', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 209, protein: 26, carbs: 0, fat: 10.9 },
  { name: 'Fish (White Fish)', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 96, protein: 20, carbs: 0, fat: 1.5 },
  { name: 'Paneer', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 265, protein: 18, carbs: 1.2, fat: 20 },
  { name: 'Tofu', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 76, protein: 8, carbs: 1.9, fat: 4.8 },
  { name: 'Greek Yogurt', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 97, protein: 9, carbs: 3.6, fat: 5 },
  { name: 'Milk (Full Fat)', category: 'Protein', servingSize: 100, servingUnit: 'ml', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 },
  { name: 'Whey Protein Scoop', category: 'Protein', servingSize: 30, servingUnit: 'g', calories: 120, protein: 24, carbs: 2, fat: 1.5 },
  { name: 'Lentils (Cooked)', category: 'Protein', servingSize: 100, servingUnit: 'g', calories: 116, protein: 9, carbs: 20, fat: 0.4 },

  // Grains
  { name: 'Rice (Cooked)', category: 'Grains', servingSize: 100, servingUnit: 'g', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'Brown Rice (Cooked)', category: 'Grains', servingSize: 100, servingUnit: 'g', calories: 112, protein: 2.3, carbs: 24, fat: 0.8 },
  { name: 'Oats', category: 'Grains', servingSize: 40, servingUnit: 'g', calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: 'Bread (White Slice)', category: 'Grains', servingSize: 1, servingUnit: 'piece', calories: 75, protein: 2.5, carbs: 14, fat: 1 },
  { name: 'Roti', category: 'Grains', servingSize: 1, servingUnit: 'piece', calories: 120, protein: 3.5, carbs: 18, fat: 3.5 },
  { name: 'Quinoa (Cooked)', category: 'Grains', servingSize: 100, servingUnit: 'g', calories: 120, protein: 4.4, carbs: 21, fat: 1.9 },
  { name: 'Pasta (Cooked)', category: 'Grains', servingSize: 100, servingUnit: 'g', calories: 131, protein: 5, carbs: 25, fat: 1.1 },

  // Fruits
  { name: 'Banana', category: 'Fruits', servingSize: 1, servingUnit: 'piece', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Apple', category: 'Fruits', servingSize: 1, servingUnit: 'piece', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Orange', category: 'Fruits', servingSize: 1, servingUnit: 'piece', calories: 62, protein: 1.2, carbs: 15, fat: 0.2 },
  { name: 'Mango', category: 'Fruits', servingSize: 100, servingUnit: 'g', calories: 60, protein: 0.8, carbs: 15, fat: 0.4 },
  { name: 'Berries Mix', category: 'Fruits', servingSize: 100, servingUnit: 'g', calories: 57, protein: 0.7, carbs: 14, fat: 0.3 },

  // Vegetables
  { name: 'Potato (Boiled)', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 87, protein: 1.9, carbs: 20, fat: 0.1 },
  { name: 'Broccoli', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: 'Spinach', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { name: 'Carrot', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 41, protein: 0.9, carbs: 10, fat: 0.2 },
  { name: 'Sweet Potato', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { name: 'Cucumber', category: 'Vegetables', servingSize: 100, servingUnit: 'g', calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1 },

  // Snacks / Others
  { name: 'Almonds', category: 'Snacks', servingSize: 28, servingUnit: 'g', calories: 160, protein: 6, carbs: 6, fat: 14 },
  { name: 'Peanut Butter', category: 'Snacks', servingSize: 1, servingUnit: 'tbsp', calories: 94, protein: 4, carbs: 3, fat: 8 },
  { name: 'Yogurt (Plain)', category: 'Snacks', servingSize: 100, servingUnit: 'g', calories: 59, protein: 3.5, carbs: 4.7, fat: 3.3 },
  { name: 'Dark Chocolate', category: 'Snacks', servingSize: 20, servingUnit: 'g', calories: 110, protein: 1.5, carbs: 10, fat: 7 },
  { name: 'Protein Bar', category: 'Others', servingSize: 1, servingUnit: 'piece', calories: 200, protein: 20, carbs: 22, fat: 6 },
  { name: 'Olive Oil', category: 'Others', servingSize: 1, servingUnit: 'tbsp', calories: 119, protein: 0, carbs: 0, fat: 13.5 },
];

module.exports = foods;
