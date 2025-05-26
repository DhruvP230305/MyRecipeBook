/**
 * Storage Module - Handles all localStorage interactions
 */

// Local storage key for recipes
const RECIPES_STORAGE_KEY = 'myRecipeBook_recipes';

/**
 * Get all recipes from localStorage
 * @returns {Array} Array of recipe objects
 */
function getAllRecipes() {
  const savedRecipes = localStorage.getItem(RECIPES_STORAGE_KEY);
  
  if (!savedRecipes) {
    // If no recipes are saved, initialize with sample recipes
    const sampleRecipes = getSampleRecipes();
    saveAllRecipes(sampleRecipes);
    return sampleRecipes;
  }
  
  try {
    return JSON.parse(savedRecipes);
  } catch (error) {
    console.error('Error parsing recipes from localStorage:', error);
    return [];
  }
}

/**
 * Save all recipes to localStorage
 * @param {Array} recipes Array of recipe objects 
 */
function saveAllRecipes(recipes) {
  try {
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving recipes to localStorage:', error);
    showToast('Failed to save recipes. Storage might be full.', 'error');
  }
}

/**
 * Get a recipe by ID
 * @param {string} id Recipe ID
 * @returns {Object|null} Recipe object or null if not found
 */
function getRecipeById(id) {
  const recipes = getAllRecipes();
  return recipes.find(recipe => recipe.id === id) || null;
}

/**
 * Add a new recipe
 * @param {Object} recipe Recipe object
 * @returns {Object} The added recipe with a new ID
 */
function addRecipe(recipe) {
  const recipes = getAllRecipes();
  
  // Generate a unique ID
  const newRecipe = {
    ...recipe,
    id: generateUniqueId(),
    dateAdded: new Date().toISOString()
  };
  
  recipes.push(newRecipe);
  saveAllRecipes(recipes);
  
  return newRecipe;
}

/**
 * Update an existing recipe
 * @param {Object} updatedRecipe Recipe object with ID
 * @returns {Object|null} Updated recipe or null if not found
 */
function updateRecipe(updatedRecipe) {
  const recipes = getAllRecipes();
  const index = recipes.findIndex(recipe => recipe.id === updatedRecipe.id);
  
  if (index === -1) return null;
  
  recipes[index] = {
    ...updatedRecipe,
    dateAdded: recipes[index].dateAdded // Preserve original date
  };
  
  saveAllRecipes(recipes);
  return recipes[index];
}

/**
 * Delete a recipe by ID
 * @param {string} id Recipe ID
 * @returns {boolean} True if deleted, false if not found
 */
function deleteRecipe(id) {
  const recipes = getAllRecipes();
  const initialLength = recipes.length;
  
  const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
  
  if (filteredRecipes.length === initialLength) {
    return false;
  }
  
  saveAllRecipes(filteredRecipes);
  return true;
}

/**
 * Generate a unique ID for new recipes
 * @returns {string} Unique ID
 */
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

/**
 * Get sample recipes for initial data
 * @returns {Array} Array of sample recipe objects
 */
function getSampleRecipes() {
  return [
    {
      id: 'sample1',
      title: 'Classic Chocolate Chip Cookies',
      description: 'Delicious homemade chocolate chip cookies with crispy edges and a soft, chewy center. Perfect for dessert or a sweet snack!',
      ingredients: [
        '2 1/4 cups all-purpose flour',
        '1 tsp baking soda',
        '1 tsp salt',
        '1 cup unsalted butter, softened',
        '3/4 cup granulated sugar',
        '3/4 cup packed brown sugar',
        '2 large eggs',
        '2 tsp vanilla extract',
        '2 cups semi-sweet chocolate chips'
      ],
      steps: [
        'Preheat oven to 375°F (190°C).',
        'In a small bowl, mix flour, baking soda, and salt.',
        'In a large bowl, cream together butter and both sugars until light and fluffy.',
        'Beat in eggs one at a time, then stir in vanilla.',
        'Gradually mix in the dry ingredients until just blended, then fold in chocolate chips.',
        'Drop by rounded tablespoons onto ungreased baking sheets.',
        'Bake for 9 to 11 minutes or until golden brown.',
        'Let stand on baking sheet for 2 minutes before removing to cool on wire racks.'
      ],
      prepTime: 15,
      cookTime: 10,
      servings: 24,
      category: 'Dessert',
      tags: ['cookies', 'chocolate', 'baking', 'dessert'],
      image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg',
      isFeatured: true,
      dateAdded: '2023-01-15T12:00:00.000Z'
    },
    {
      id: 'sample2',
      title: 'Mediterranean Quinoa Salad',
      description: 'A healthy, protein-packed salad with fresh vegetables and a zesty lemon dressing. Perfect for meal prep or a light lunch!',
      ingredients: [
        '1 cup quinoa, rinsed',
        '2 cups water',
        '1 cucumber, diced',
        '1 pint cherry tomatoes, halved',
        '1 red bell pepper, diced',
        '1/2 red onion, finely diced',
        '1/2 cup kalamata olives, pitted and sliced',
        '1/2 cup feta cheese, crumbled',
        '1/4 cup fresh parsley, chopped',
        '3 tbsp olive oil',
        '2 tbsp lemon juice',
        '1 tsp dried oregano',
        'Salt and pepper to taste'
      ],
      steps: [
        'Combine quinoa and water in a medium saucepan. Bring to a boil, then reduce heat to low, cover, and simmer for 15 minutes until water is absorbed.',
        'Remove from heat and let stand, covered, for 5 minutes. Fluff with a fork and let cool to room temperature.',
        'In a large bowl, combine cooled quinoa, cucumber, tomatoes, bell pepper, red onion, olives, feta cheese, and parsley.',
        'In a small bowl, whisk together olive oil, lemon juice, oregano, salt, and pepper.',
        'Pour dressing over salad and toss to combine.',
        'Serve immediately or refrigerate for up to 3 days.'
      ],
      prepTime: 20,
      cookTime: 15,
      servings: 6,
      category: 'Vegetarian',
      tags: ['salad', 'healthy', 'meal prep', 'vegetarian'],
      image: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg',
      isFeatured: true,
      dateAdded: '2023-02-10T14:30:00.000Z'
    },
    {
      id: 'sample3',
      title: 'Classic Margherita Pizza',
      description: 'A simple yet delicious pizza with fresh tomatoes, mozzarella, and basil. The perfect weeknight dinner that everyone will love!',
      ingredients: [
        '1 lb pizza dough',
        '1/4 cup tomato sauce',
        '8 oz fresh mozzarella, sliced',
        '2 medium tomatoes, sliced',
        '1/4 cup fresh basil leaves',
        '2 tbsp olive oil',
        '1 tsp salt',
        '1/2 tsp black pepper',
        '1/4 tsp red pepper flakes (optional)'
      ],
      steps: [
        'Preheat oven to 475°F (245°C). If using a pizza stone, place it in the oven to heat.',
        'On a floured surface, roll out the pizza dough to a 12-inch circle.',
        'Transfer dough to a pizza pan or a parchment-lined baking sheet.',
        'Spread tomato sauce evenly over the dough, leaving a 1/2-inch border.',
        'Arrange mozzarella slices and tomato slices on top.',
        'Drizzle with olive oil and sprinkle with salt, pepper, and red pepper flakes if using.',
        'Bake for 12-15 minutes, until crust is golden and cheese is bubbly.',
        'Remove from oven and immediately top with fresh basil leaves.',
        'Let cool for 2 minutes before slicing and serving.'
      ],
      prepTime: 20,
      cookTime: 15,
      servings: 4,
      category: 'Dinner',
      tags: ['pizza', 'Italian', 'vegetarian', 'quick'],
      image: 'https://images.pexels.com/photos/2608049/pexels-photo-2608049.jpeg',
      isFeatured: true,
      dateAdded: '2023-03-05T18:45:00.000Z'
    },
    {
      id: 'sample4',
      title: 'Homemade Chicken Noodle Soup',
      description: 'A comforting classic that\'s perfect for cold days or when you\'re feeling under the weather. Made with tender chicken, hearty vegetables, and egg noodles.',
      ingredients: [
        '1 tablespoon olive oil',
        '1 onion, diced',
        '3 carrots, sliced',
        '3 celery stalks, sliced',
        '3 garlic cloves, minced',
        '8 cups chicken broth',
        '2 bay leaves',
        '1/2 teaspoon dried thyme',
        '1/2 teaspoon dried rosemary',
        '2 cups cooked, shredded chicken',
        '2 cups egg noodles',
        '2 tablespoons fresh parsley, chopped',
        'Salt and pepper to taste'
      ],
      steps: [
        'Heat olive oil in a large pot over medium heat. Add onion, carrots, and celery, and cook until vegetables begin to soften, about 5 minutes.',
        'Add garlic and cook for another 30 seconds until fragrant.',
        'Pour in chicken broth and add bay leaves, thyme, and rosemary. Bring to a boil.',
        'Reduce heat to low and simmer for 10 minutes.',
        'Add egg noodles and cook until tender, about 6-8 minutes.',
        'Stir in shredded chicken and cook until heated through, about 2 minutes.',
        'Remove bay leaves and stir in fresh parsley.',
        'Season with salt and pepper to taste before serving.'
      ],
      prepTime: 15,
      cookTime: 30,
      servings: 6,
      category: 'Dinner',
      tags: ['soup', 'comfort food', 'chicken'],
      image: 'https://images.pexels.com/photos/5710170/pexels-photo-5710170.jpeg',
      isFeatured: false,
      dateAdded: '2023-04-12T11:20:00.000Z'
    },
    {
      id: 'sample5',
      title: 'Avocado Toast with Poached Egg',
      description: 'Upgrade your breakfast with this nutritious and Instagram-worthy avocado toast topped with a perfectly poached egg.',
      ingredients: [
        '2 slices whole grain bread',
        '1 ripe avocado',
        '2 eggs',
        '1 tablespoon white vinegar',
        '1/4 teaspoon red pepper flakes',
        '1/4 teaspoon salt',
        '1/4 teaspoon black pepper',
        '1 tablespoon fresh lemon juice',
        '2 teaspoons extra virgin olive oil',
        'Fresh herbs for garnish (optional)'
      ],
      steps: [
        'Toast the bread slices until golden and crisp.',
        'In a small bowl, mash the avocado with lemon juice, salt, and pepper.',
        'Fill a medium saucepan with about 3 inches of water. Add vinegar and bring to a gentle simmer.',
        'Crack an egg into a small bowl. Create a gentle whirlpool in the simmering water and carefully slide the egg in. Repeat with second egg.',
        'Cook eggs for 3 minutes for a runny yolk, then remove with a slotted spoon and place on a paper towel to drain.',
        'Spread the mashed avocado on the toast slices.',
        'Top each toast with a poached egg, sprinkle with red pepper flakes, and drizzle with olive oil.',
        'Garnish with fresh herbs if desired and serve immediately.'
      ],
      prepTime: 10,
      cookTime: 5,
      servings: 2,
      category: 'Breakfast',
      tags: ['breakfast', 'healthy', 'quick', 'vegetarian'],
      image: 'https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg',
      isFeatured: true,
      dateAdded: '2023-05-20T08:15:00.000Z'
    },
    {
      id: 'sample6',
      title: 'Honey Garlic Salmon',
      description: 'Delicious salmon fillets glazed with a sweet and savory honey garlic sauce. A quick and healthy dinner option ready in just 20 minutes!',
      ingredients: [
        '4 salmon fillets (about 6 oz each)',
        '4 tablespoons honey',
        '3 tablespoons soy sauce',
        '3 cloves garlic, minced',
        '1 tablespoon lemon juice',
        '1 tablespoon olive oil',
        '1/2 teaspoon red pepper flakes (optional)',
        'Salt and pepper to taste',
        'Chopped parsley for garnish',
        'Lemon wedges for serving'
      ],
      steps: [
        'In a small bowl, whisk together honey, soy sauce, garlic, lemon juice, and red pepper flakes (if using).',
        'Pat salmon fillets dry with paper towels and season both sides with salt and pepper.',
        'Heat olive oil in a large skillet over medium-high heat.',
        'Add salmon fillets to the skillet, skin-side down (if they have skin), and cook for 4-5 minutes until the skin is crispy.',
        'Flip the salmon and cook for another 2 minutes.',
        'Pour the honey garlic sauce over the salmon and reduce heat to medium-low.',
        'Cook for another 1-2 minutes, spooning the sauce over the salmon until the sauce thickens slightly and the salmon is cooked through.',
        'Garnish with chopped parsley and serve with lemon wedges.'
      ],
      prepTime: 5,
      cookTime: 15,
      servings: 4,
      category: 'Dinner',
      tags: ['seafood', 'quick dinner', 'healthy', 'gluten-free'],
      image: 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg',
      isFeatured: false,
      dateAdded: '2023-06-08T19:10:00.000Z'
    }
  ];
}

/**
 * Show a toast notification
 * @param {string} message Message to display
 * @param {string} type Toast type ('success' or 'error')
 */
function showToast(message, type = 'success') {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Create icon based on toast type
  const icon = document.createElement('i');
  icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
  
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = 'toast-message';
  messageEl.textContent = message;
  
  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.innerHTML = '<i class="fas fa-times"></i>';
  closeBtn.addEventListener('click', () => {
    toast.style.animation = 'slideOut 0.3s forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  });
  
  // Append elements to toast
  toast.appendChild(icon);
  toast.appendChild(messageEl);
  toast.appendChild(closeBtn);
  
  // Add toast to container
  toastContainer.appendChild(toast);
  
  // Remove toast after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'slideOut 0.3s forwards';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }
  }, 5000);
}