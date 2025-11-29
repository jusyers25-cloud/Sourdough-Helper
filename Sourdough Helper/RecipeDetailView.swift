import SwiftUI

struct RecipeDetailView: View {
    let recipe: Recipe
    @ObservedObject var store: RecipeStore
    @Environment(\.dismiss) var dismiss
    @State private var showingDeleteAlert = false
    @State private var showingEditSheet = false
    
    var body: some View {
        NavigationView {
            ZStack {
                AppColors.background.ignoresSafeArea()
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        // Header
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(recipe.name)
                                    .font(.title)
                                    .fontWeight(.bold)
                                    .foregroundColor(AppColors.primary)
                                
                                Text(formattedDate(recipe.dateCreated))
                                    .font(.subheadline)
                                    .foregroundColor(AppColors.secondary)
                            }
                            
                            Spacer()
                            
                            Button(action: {
                                withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                                    store.toggleFavorite(recipe)
                                }
                            }) {
                                Image(systemName: recipe.isFavorite ? "heart.fill" : "heart")
                                    .font(.title2)
                                    .foregroundColor(recipe.isFavorite ? .red : AppColors.secondary)
                            }
                        }
                        
                        // Notes (if present)
                        if !recipe.notes.isEmpty {
                            VStack(alignment: .leading, spacing: 8) {
                                HStack {
                                    Image(systemName: "note.text")
                                        .foregroundColor(AppColors.secondary)
                                    Text("Notes")
                                        .font(.headline)
                                        .foregroundColor(AppColors.primary)
                                }
                                
                                Text(recipe.notes)
                                    .font(.body)
                                    .foregroundColor(AppColors.secondary)
                                    .padding()
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .background(AppColors.card)
                                    .cornerRadius(12)
                            }
                        }
                        
                        // Ingredients Section
                        RecipeSection(
                            title: "Ingredients",
                            icon: "list.bullet",
                            content: recipe.ingredients
                        )
                        
                        // Instructions Section
                        RecipeSection(
                            title: "Instructions",
                            icon: "doc.text",
                            content: recipe.instructions
                        )
                    }
                    .padding()
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Done") {
                        dismiss()
                    }
                    .foregroundColor(AppColors.secondary)
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Button(action: {
                            showingEditSheet = true
                        }) {
                            Label("Edit", systemImage: "pencil")
                        }
                        
                        Button(role: .destructive, action: {
                            showingDeleteAlert = true
                        }) {
                            Label("Delete", systemImage: "trash")
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                            .foregroundColor(AppColors.secondary)
                    }
                }
            }
            .alert("Delete Recipe?", isPresented: $showingDeleteAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Delete", role: .destructive) {
                    store.deleteRecipe(recipe)
                    dismiss()
                }
            } message: {
                Text("This action cannot be undone.")
            }
            .sheet(isPresented: $showingEditSheet) {
                EditRecipeView(recipe: recipe, store: store)
            }
        }
    }
    
    func formattedDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .long
        return formatter.string(from: date)
    }
}

struct RecipeSection: View {
    let title: String
    let icon: String
    let content: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(AppColors.secondary)
                Text(title)
                    .font(.headline)
                    .foregroundColor(AppColors.primary)
            }
            
            Text(content)
                .font(.body)
                .foregroundColor(AppColors.primary)
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(AppColors.card)
                .cornerRadius(12)
                .shadow(color: AppColors.primary.opacity(0.08), radius: 6, x: 0, y: 3)
        }
    }
}

#Preview {
    RecipeDetailView(
        recipe: Recipe(
            name: "Classic Sourdough",
            ingredients: "500g flour\n350g water\n100g starter\n10g salt",
            instructions: "1. Mix\n2. Ferment\n3. Shape\n4. Bake",
            notes: "Great recipe!"
        ),
        store: RecipeStore()
    )
}
