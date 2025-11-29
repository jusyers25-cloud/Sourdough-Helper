import Foundation

class RecipeStore: ObservableObject {
    @Published var recipes: [Recipe] = []
    
    private let saveKey = "SavedRecipes"
    
    init() {
        load()
        
        // Add sample recipes if empty
        if recipes.isEmpty {
            addSampleRecipes()
        }
    }
    
    func addRecipe(_ recipe: Recipe) {
        recipes.insert(recipe, at: 0)
        save()
    }
    
    func updateRecipe(_ recipe: Recipe) {
        if let index = recipes.firstIndex(where: { $0.id == recipe.id }) {
            recipes[index] = recipe
            save()
        }
    }
    
    func deleteRecipe(_ recipe: Recipe) {
        recipes.removeAll { $0.id == recipe.id }
        save()
    }
    
    func toggleFavorite(_ recipe: Recipe) {
        if let index = recipes.firstIndex(where: { $0.id == recipe.id }) {
            recipes[index].isFavorite.toggle()
            save()
        }
    }
    
    private func save() {
        if let encoded = try? JSONEncoder().encode(recipes) {
            UserDefaults.standard.set(encoded, forKey: saveKey)
        }
    }
    
    private func load() {
        if let data = UserDefaults.standard.data(forKey: saveKey),
           let decoded = try? JSONDecoder().decode([Recipe].self, from: data) {
            recipes = decoded
        }
    }
    
    private func addSampleRecipes() {
        let sample1 = Recipe(
            name: "Classic Sourdough Boule",
            ingredients: """
            • 500g bread flour
            • 350g water (70% hydration)
            • 100g active sourdough starter
            • 10g salt
            """,
            instructions: """
            1. Mix flour and water, autolyse for 30 minutes
            2. Add starter and salt, mix until combined
            3. Bulk ferment 4-6 hours with stretch & folds every 30 min
            4. Shape and place in banneton
            5. Cold proof in fridge overnight
            6. Bake at 450°F in Dutch oven: 20 min covered, 25 min uncovered
            """,
            notes: "Perfect for beginners! Adjust hydration if too sticky.",
            isFavorite: true
        )
        
        let sample2 = Recipe(
            name: "Whole Wheat Sandwich Loaf",
            ingredients: """
            • 300g bread flour
            • 200g whole wheat flour
            • 350g water
            • 100g active starter
            • 10g salt
            • 20g honey (optional)
            """,
            instructions: """
            1. Mix all ingredients except salt
            2. Autolyse 30 minutes
            3. Add salt, knead 5 minutes
            4. Bulk ferment 4-5 hours
            5. Shape into loaf pan
            6. Proof 2-3 hours
            7. Bake at 375°F for 40-45 minutes
            """,
            notes: "Great for sandwiches and toast!"
        )
        
        recipes = [sample1, sample2]
        save()
    }
}
