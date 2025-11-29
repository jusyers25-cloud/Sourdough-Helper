import SwiftUI

struct AddRecipeView: View {
    @ObservedObject var store: RecipeStore
    @Environment(\.dismiss) var dismiss
    
    @State private var name = ""
    @State private var ingredients = ""
    @State private var instructions = ""
    @State private var notes = ""
    
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
                            
                            TextField("e.g., Classic Sourdough", text: $name)
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
                        Button(action: saveRecipe) {
                            Text("Save Recipe")
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
            .navigationTitle("New Recipe")
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
    
    func saveRecipe() {
        let recipe = Recipe(
            name: name,
            ingredients: ingredients,
            instructions: instructions,
            notes: notes
        )
        store.addRecipe(recipe)
        dismiss()
    }
}

struct CustomTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding(12)
            .background(AppColors.card)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(AppColors.light, lineWidth: 1)
            )
    }
}

#Preview {
    AddRecipeView(store: RecipeStore())
}
