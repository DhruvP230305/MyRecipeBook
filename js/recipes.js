/**
 * Recipes Module - Handles recipe rendering and manipulation
 */

/**
 * Display featured recipes on the home page
 */
function displayFeaturedRecipes() {
  const recipes = getAllRecipes();
  const featuredRecipes = recipes.filter(recipe => recipe.isFeatured);
  const featuredGrid = document.getElementById('featured-recipes-grid');
  
  if (!featuredGrid) return;
  
  // Clear loading skeletons
  featuredGrid.innerHTML = '';
  
  // If no featured recipes, show message
  if (featuredRecipes.length === 0) {
    featuredGrid.innerHTML = `
      <div class="no-recipes-message">
        <p>No featured recipes yet.</p>
        <a href="add-recipe.html" class="btn btn-secondary">Add Your First Recipe</a>
      </div>
    `;
    return;
  }
  
  // Display up to 4 featured recipes
  const recipesToDisplay = featuredRecipes.slice(0, 4);
  recipesToDisplay.forEach(recipe => {
    featuredGrid.appendChild(createRecipeCard(recipe));
  });
  
  // Add animation to cards
  animateRecipeCards();
}

/**
 * Display all recipes on the recipes page
 */
function displayAllRecipes() {
  const recipes = getAllRecipes();
  const recipesGrid = document.getElementById('all-recipes-grid');
  const noRecipesMessage = document.getElementById('no-recipes-message');
  
  if (!recipesGrid) return;
  
  // Clear loading skeletons
  recipesGrid.innerHTML = '';
  
  // If no recipes, show message
  if (recipes.length === 0) {
    recipesGrid.style.display = 'none';
    noRecipesMessage.style.display = 'block';
    return;
  }
  
  recipesGrid.style.display = 'grid';
  noRecipesMessage.style.display = 'none';
  
  // Sort recipes by date, newest first
  const sortedRecipes = [...recipes].sort((a, b) => {
    return new Date(b.dateAdded) - new Date(a.dateAdded);
  });
  
  sortedRecipes.forEach(recipe => {
    recipesGrid.appendChild(createRecipeCard(recipe));
  });
  
  // Add animation to cards
  animateRecipeCards();
}

/**
 * Create and return a recipe card element
 * @param {Object} recipe Recipe object
 * @returns {HTMLElement} Recipe card element
 */
function createRecipeCard(recipe) {
  const card = document.createElement('article');
  card.className = 'recipe-card';
  card.setAttribute('data-id', recipe.id);
  
  card.innerHTML = `
    <div class="recipe-card-image">
      <img src="${recipe.image}" alt="${recipe.title}">
      <span class="recipe-card-category">${recipe.category}</span>
    </div>
    <div class="recipe-card-content">
      <h3 class="recipe-card-title">${recipe.title}</h3>
      <p class="recipe-card-description">${recipe.description}</p>
      <div class="recipe-card-meta">
        <div class="prep-time">
          <i class="fas fa-clock"></i>
          <span>Prep: ${recipe.prepTime} min</span>
        </div>
        <div class="cook-time">
          <i class="fas fa-fire"></i>
          <span>Cook: ${recipe.cookTime} min</span>
        </div>
      </div>
      <div class="recipe-card-actions">
        <a href="recipe-detail.html?id=${recipe.id}" class="btn btn-primary">View Recipe</a>
      </div>
    </div>
  `;
  
  return card;
}

/**
 * Animate recipe cards with a fade-in effect
 */
function animateRecipeCards() {
  const cards = document.querySelectorAll('.recipe-card');
  
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Stagger the animations
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 * index);
  });
}

/**
 * Display a single recipe on the recipe detail page
 */
function displayRecipeDetail() {
  // Get recipe ID from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get('id');
  
  if (!recipeId) {
    window.location.href = 'recipes.html';
    return;
  }
  
  const recipe = getRecipeById(recipeId);
  const recipeDetailElement = document.getElementById('recipe-detail');
  
  if (!recipe) {
    recipeDetailElement.innerHTML = `
      <div class="no-recipe-message">
        <h2>Recipe Not Found</h2>
        <p>The recipe you're looking for doesn't exist or may have been deleted.</p>
        <a href="recipes.html" class="btn btn-primary">Back to Recipes</a>
      </div>
    `;
    return;
  }
  
  // Update page title
  document.title = `${recipe.title} - MyRecipeBook`;
  
  // Clear loading skeleton
  recipeDetailElement.innerHTML = '';
  
  // Create recipe detail HTML
  recipeDetailElement.innerHTML = `
    <div class="recipe-detail-header">
      <img src="${recipe.image}" alt="${recipe.title}" class="recipe-detail-image">
      <div class="recipe-detail-overlay">
        <h1 class="recipe-detail-title">${recipe.title}</h1>
        <div class="recipe-detail-meta">
          <span><i class="fas fa-clock"></i> Prep: ${recipe.prepTime} min</span>
          <span><i class="fas fa-fire"></i> Cook: ${recipe.cookTime} min</span>
          <span><i class="fas fa-utensils"></i> Serves: ${recipe.servings}</span>
          <span><i class="fas fa-folder"></i> ${recipe.category}</span>
        </div>
      </div>
    </div>
    <div class="recipe-detail-content">
      <p class="recipe-detail-description">${recipe.description}</p>
      
      <div class="recipe-detail-ingredients">
        <h2 class="recipe-detail-section-title">Ingredients</h2>
        <ul class="ingredients-list">
          ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
      </div>
      
      <div class="recipe-detail-steps">
        <h2 class="recipe-detail-section-title">Instructions</h2>
        <ol class="steps-list">
          ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
        </ol>
      </div>
      
      ${recipe.tags && recipe.tags.length ? `
        <div class="recipe-detail-tags">
          ${recipe.tags.map(tag => `<span class="recipe-tag">${tag}</span>`).join('')}
        </div>
      ` : ''}
      
      <div class="recipe-detail-actions">
        <a href="add-recipe.html?edit=${recipe.id}" class="btn btn-secondary">
          <i class="fas fa-edit"></i> Edit Recipe
        </a>
        <button id="delete-recipe-btn" class="btn btn-outline" data-id="${recipe.id}">
          <i class="fas fa-trash"></i> Delete Recipe
        </button>
      </div>
    </div>
  `;
  
  // Add delete functionality
  const deleteButton = document.getElementById('delete-recipe-btn');
  if (deleteButton) {
    deleteButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this recipe?')) {
        deleteRecipe(recipeId);
        showToast('Recipe deleted successfully', 'success');
        setTimeout(() => {
          window.location.href = 'recipes.html';
        }, 1500);
      }
    });
  }
}

/**
 * Initialize the add/edit recipe page
 */
function initAddRecipePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('edit');
  const isEditMode = !!editId;
  
  const form = document.getElementById('recipe-form');
  const formTitle = document.getElementById('form-title');
  const saveButton = document.getElementById('save-button');
  
  // Set up form for edit mode if needed
  if (isEditMode) {
    formTitle.textContent = 'Edit Recipe';
    saveButton.textContent = 'Update Recipe';
    
    const recipe = getRecipeById(editId);
    if (!recipe) {
      window.location.href = 'recipes.html';
      return;
    }
    
    // Populate form with recipe data
    document.getElementById('recipe-title').value = recipe.title;
    document.getElementById('recipe-description').value = recipe.description;
    document.getElementById('prep-time').value = recipe.prepTime;
    document.getElementById('cook-time').value = recipe.cookTime;
    document.getElementById('servings').value = recipe.servings;
    document.getElementById('recipe-category').value = recipe.category;
    document.getElementById('recipe-tags').value = recipe.tags.join(', ');
    document.getElementById('recipe-image').value = recipe.image;
    document.getElementById('featured-recipe').checked = recipe.isFeatured;
    
    // Preview image
    const imagePreview = document.getElementById('image-preview');
    imagePreview.innerHTML = `<img src="${recipe.image}" alt="Recipe image preview">`;
    
    // Populate ingredients
    const ingredientsContainer = document.getElementById('ingredients-container');
    ingredientsContainer.innerHTML = '';
    
    recipe.ingredients.forEach((ingredient, index) => {
      const ingredientGroup = createIngredientInput(ingredient);
      ingredientsContainer.appendChild(ingredientGroup);
    });
    
    // Populate steps
    const stepsContainer = document.getElementById('steps-container');
    stepsContainer.innerHTML = '';
    
    recipe.steps.forEach((step, index) => {
      const stepGroup = createStepInput(step, index + 1);
      stepsContainer.appendChild(stepGroup);
    });
  }
  
  // Set up image preview
  const imageInput = document.getElementById('recipe-image');
  const imagePreview = document.getElementById('image-preview');
  
  imageInput.addEventListener('input', () => {
    const imageUrl = imageInput.value.trim();
    if (imageUrl) {
      imagePreview.innerHTML = `
        <img src="${imageUrl}" alt="Recipe image preview" onerror="this.onerror=null; this.parentNode.innerHTML='<i class=\\'fas fa-exclamation-circle\\'></i><span>Invalid image URL</span>';">
      `;
    } else {
      imagePreview.innerHTML = `
        <i class="fas fa-image"></i>
        <span>Image preview will appear here</span>
      `;
    }
  });
  
  // Add ingredient button functionality
  const addIngredientBtn = document.getElementById('add-ingredient-btn');
  const ingredientsContainer = document.getElementById('ingredients-container');
  
  addIngredientBtn.addEventListener('click', () => {
    const ingredientGroup = createIngredientInput();
    ingredientsContainer.appendChild(ingredientGroup);
    ingredientGroup.querySelector('input').focus();
  });
  
  // Add step button functionality
  const addStepBtn = document.getElementById('add-step-btn');
  const stepsContainer = document.getElementById('steps-container');
  
  addStepBtn.addEventListener('click', () => {
    const stepCount = stepsContainer.children.length + 1;
    const stepGroup = createStepInput('', stepCount);
    stepsContainer.appendChild(stepGroup);
    stepGroup.querySelector('textarea').focus();
  });
  
  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Collect form data
    const title = document.getElementById('recipe-title').value.trim();
    const description = document.getElementById('recipe-description').value.trim();
    const prepTime = parseInt(document.getElementById('prep-time').value);
    const cookTime = parseInt(document.getElementById('cook-time').value);
    const servings = parseInt(document.getElementById('servings').value);
    const category = document.getElementById('recipe-category').value;
    const tagsInput = document.getElementById('recipe-tags').value.trim();
    const image = document.getElementById('recipe-image').value.trim();
    const isFeatured = document.getElementById('featured-recipe').checked;
    
    // Collect ingredients
    const ingredientInputs = document.querySelectorAll('.ingredient-input');
    const ingredients = Array.from(ingredientInputs)
      .map(input => input.value.trim())
      .filter(ingredient => ingredient !== '');
    
    // Collect steps
    const stepInputs = document.querySelectorAll('.step-input');
    const steps = Array.from(stepInputs)
      .map(input => input.value.trim())
      .filter(step => step !== '');
    
    // Parse tags
    const tags = tagsInput
      ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      : [];
    
    // Create recipe object
    const recipe = {
      title,
      description,
      ingredients,
      steps,
      prepTime,
      cookTime,
      servings,
      category,
      tags,
      image,
      isFeatured
    };
    
    if (isEditMode) {
      // Update existing recipe
      recipe.id = editId;
      updateRecipe(recipe);
      showToast('Recipe updated successfully', 'success');
    } else {
      // Add new recipe
      addRecipe(recipe);
      showToast('Recipe added successfully', 'success');
    }
    
    // Redirect after short delay
    setTimeout(() => {
      window.location.href = 'recipes.html';
    }, 1500);
  });
}

/**
 * Create and return an ingredient input group
 * @param {string} [value=''] Initial value
 * @returns {HTMLElement} Ingredient input group element
 */
function createIngredientInput(value = '') {
  const div = document.createElement('div');
  div.className = 'ingredient-input-group';
  
  div.innerHTML = `
    <input type="text" class="ingredient-input" placeholder="e.g. 2 cups flour" value="${value}" required>
    <button type="button" class="remove-ingredient-btn"><i class="fas fa-times"></i></button>
  `;
  
  const removeBtn = div.querySelector('.remove-ingredient-btn');
  removeBtn.addEventListener('click', () => {
    const container = document.getElementById('ingredients-container');
    if (container.children.length > 1) {
      div.remove();
    } else {
      div.querySelector('input').value = '';
      showToast('You need at least one ingredient', 'error');
    }
  });
  
  return div;
}

/**
 * Create and return a step input group
 * @param {string} [value=''] Initial value
 * @param {number} stepNumber Step number
 * @returns {HTMLElement} Step input group element
 */
function createStepInput(value = '', stepNumber) {
  const div = document.createElement('div');
  div.className = 'step-input-group';
  
  div.innerHTML = `
    <span class="step-number">${stepNumber}</span>
    <textarea class="step-input" rows="2" placeholder="Describe this step" required>${value}</textarea>
    <button type="button" class="remove-step-btn"><i class="fas fa-times"></i></button>
  `;
  
  const removeBtn = div.querySelector('.remove-step-btn');
  removeBtn.addEventListener('click', () => {
    const container = document.getElementById('steps-container');
    if (container.children.length > 1) {
      div.remove();
      
      // Update step numbers
      const stepGroups = container.querySelectorAll('.step-input-group');
      stepGroups.forEach((group, index) => {
        group.querySelector('.step-number').textContent = index + 1;
      });
    } else {
      div.querySelector('textarea').value = '';
      showToast('You need at least one step', 'error');
    }
  });
  
  return div;
}

/**
 * Initialize search and filter functionality
 */
function initSearchAndFilter() {
  const searchInput = document.getElementById('recipe-search');
  const categoryFilter = document.getElementById('category-filter');
  const recipesGrid = document.getElementById('all-recipes-grid');
  const noRecipesMessage = document.getElementById('no-recipes-message');
  
  if (!searchInput || !categoryFilter) return;
  
  // Function to filter recipes
  function filterRecipes() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    
    const recipes = getAllRecipes();
    
    // Apply filters
    const filteredRecipes = recipes.filter(recipe => {
      const matchesSearch = searchTerm === '' || 
        recipe.title.toLowerCase().includes(searchTerm) || 
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm));
      
      const matchesCategory = category === '' || recipe.category === category;
      
      return matchesSearch && matchesCategory;
    });
    
    // Sort by date added, newest first
    const sortedRecipes = [...filteredRecipes].sort((a, b) => {
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    });
    
    // Update display
    recipesGrid.innerHTML = '';
    
    if (sortedRecipes.length === 0) {
      recipesGrid.style.display = 'none';
      noRecipesMessage.style.display = 'block';
    } else {
      recipesGrid.style.display = 'grid';
      noRecipesMessage.style.display = 'none';
      
      sortedRecipes.forEach(recipe => {
        recipesGrid.appendChild(createRecipeCard(recipe));
      });
      
      // Add animation to cards
      animateRecipeCards();
    }
  }
  
  // Add event listeners
  searchInput.addEventListener('input', filterRecipes);
  categoryFilter.addEventListener('change', filterRecipes);
}