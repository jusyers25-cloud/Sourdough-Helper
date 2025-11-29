import SwiftUI

struct RecipesView: View {
    @StateObject private var store = RecipeStore()
    @State private var showingAddRecipe = false
    @State private var selectedRecipe: Recipe?
    @State private var showingRecipeDetail = false
    
    var body: some View {
        NavigationView {
            ZStack {
                AppColors.background.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 16) {
                        // Header
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("My Recipes")
                                    .font(.largeTitle)
                                    .fontWeight(.bold)
                                    .foregroundColor(AppColors.primary)
                                
                                Text("\(store.recipes.count) saved recipes")
                                    .font(.subheadline)
                                    .foregroundColor(AppColors.secondary)
                            }
                            
                            Spacer()
                            
                            Button(action: {
                                showingAddRecipe = true
                            }) {
                                Image(systemName: "plus.circle.fill")
                                    .font(.system(size: 32))
                                    .foregroundColor(AppColors.secondary)
                            }
                        }
                        .padding(.horizontal)
                        .padding(.top, 20)
                        
                        // Recipes List
                        if store.recipes.isEmpty {
                            EmptyRecipesView(showingAddRecipe: $showingAddRecipe)
                        } else {
                            LazyVStack(spacing: 12) {
                                ForEach(store.recipes) { recipe in
                                    RecipeCard(recipe: recipe, store: store)
                                        .onTapGesture {
                                            selectedRecipe = recipe
                                            showingRecipeDetail = true
                                        }
                                }
                            }
                            .padding(.horizontal)
                        }
                    }
                    .padding(.bottom, 20)
                }
            }
            .navigationBarHidden(true)
            .sheet(isPresented: $showingAddRecipe) {
                AddRecipeView(store: store)
            }
            .sheet(item: $selectedRecipe) { recipe in
                RecipeDetailView(recipe: recipe, store: store)
            }
        }
    }
}

struct RecipeCard: View {
    let recipe: Recipe
    @ObservedObject var store: RecipeStore
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(recipe.name)
                        .font(.headline)
                        .foregroundColor(AppColors.primary)
                    
                    Text(formattedDate(recipe.dateCreated))
                        .font(.caption)
                        .foregroundColor(AppColors.secondary)
                }
                
                Spacer()
                
                Button(action: {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                        store.toggleFavorite(recipe)
                    }
                }) {
                    Image(systemName: recipe.isFavorite ? "heart.fill" : "heart")
                        .font(.title3)
                        .foregroundColor(recipe.isFavorite ? .red : AppColors.secondary)
                }
            }
            
            if !recipe.notes.isEmpty {
                Text(recipe.notes)
                    .font(.subheadline)
                    .foregroundColor(AppColors.secondary)
                    .lineLimit(2)
            }
            
            HStack {
                Image(systemName: "book.closed")
                    .font(.caption)
                    .foregroundColor(AppColors.accent)
                
                Text("Tap to view recipe")
                    .font(.caption)
                    .foregroundColor(AppColors.accent)
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(AppColors.light)
            }
        }
        .padding()
        .background(AppColors.card)
        .cornerRadius(16)
        .shadow(color: AppColors.primary.opacity(0.1), radius: 8, x: 0, y: 4)
    }
    
    func formattedDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: date)
    }
}

struct EmptyRecipesView: View {
    @Binding var showingAddRecipe: Bool
    
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "book.closed")
                .font(.system(size: 60))
                .foregroundColor(AppColors.light)
            
            Text("No Recipes Yet")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(AppColors.primary)
            
            Text("Add your first sourdough recipe to get started")
                .font(.subheadline)
                .foregroundColor(AppColors.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
            
            Button(action: {
                showingAddRecipe = true
            }) {
                Text("Add Recipe")
                    .font(.headline)
                    .foregroundColor(.white)
                    .padding(.horizontal, 30)
                    .padding(.vertical, 14)
                    .background(AppColors.secondary)
                    .cornerRadius(12)
            }
        }
        .padding(.top, 60)
    }
}

#Preview {
    RecipesView()
}
