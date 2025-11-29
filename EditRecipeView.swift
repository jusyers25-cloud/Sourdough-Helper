import SwiftUI

struct EditRecipeView: View {
    let recipe: Recipe
    @ObservedObject var store: RecipeStore
    @Environment(\.dismiss) var dismiss
    
    @State private var name: String
    @State private var ingredients: String
    @State private var instructions: String
    @State private var notes: String
    
    init(recipe: Recipe, store: RecipeStore) {
        self.recipe = recipe
        self.store = store
        _name = State(initialValue: recipe.name)
        _ingredients = State(initialValue: recipe.ingredients)
        _instructions = State(initialValue: recipe.instructions)
        _notes = State(initialValue: recipe.notes)
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                AppColors.background.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 20) {
                        // Name Field
                        VStack(alignment: .leading, spacing: 8) {
                            Label("Recipe Name", systemImage: "pencil")
                                .font(.headline)
                                .foregroundColor(AppColors.primary)
                            
                            TextField("Recipe name", text: $name)
                                .textFieldStyle(CustomTextFieldStyle())
                        }
                        
                        // Ingredients Field
                        VStack(alignment: .leading, spacing: 8) {
                            Label("Ingredients", systemImage: "list.bullet")
                                .font(.headline)
                                .foregroundColor(AppColors.primary)
                            
                            TextEditor(text: $ingredients)
                                .frame(minHeight: 120)
                                .padding(8)
                                .background(AppColors.card)
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(AppColors.light, lineWidth: 1)
                                )
                        }
                        
                        // Instructions Field
                        VStack(alignment: .leading, spacing: 8) {
                            Label("Instructions", systemImage: "doc.text")
                                .font(.headline)
                                .foregroundColor(AppColors.primary)
                            
                            TextEditor(text: $instructions)
                                .frame(minHeight: 180)
                                .padding(8)
                                .background(AppColors.card)
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(AppColors.light, lineWidth: 1)
                                )
                        }
                        
                        // Notes Field
                        VStack(alignment: .leading, spacing: 8) {
                            Label("Notes (Optional)", systemImage: "note.text")
                                .font(.headline)
                                .foregroundColor(AppColors.primary)
                            
                            TextEditor(text: $notes)
                                .frame(minHeight: 80)
                                .padding(8)
                                .background(AppColors.card)
                                .cornerRadius(12)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(AppColors.light, lineWidth: 1)
                                )
                        }
                        
                        // Save Button
                        Button(action: saveChanges) {
                            Text("Save Changes")
                                .font(.headline)
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 16)
                                .background(name.isEmpty ? AppColors.light : AppColors.secondary)
                                .cornerRadius(12)
                        }
                        .disabled(name.isEmpty)
                        .padding(.top, 10)
                    }
                    .padding()
                }
            }
            .navigationTitle("Edit Recipe")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(AppColors.secondary)
                }
            }
        }
    }
    
    func saveChanges() {
        var updatedRecipe = recipe
        updatedRecipe.name = name
        updatedRecipe.ingredients = ingredients
        updatedRecipe.instructions = instructions
        updatedRecipe.notes = notes
        
        store.updateRecipe(updatedRecipe)
        dismiss()
    }
}

#Preview {
    EditRecipeView(
        recipe: Recipe(
            name: "Test Recipe",
            ingredients: "Flour, Water",
            instructions: "Mix and bake",
            notes: "Great!"
        ),
        store: RecipeStore()
    )
}
