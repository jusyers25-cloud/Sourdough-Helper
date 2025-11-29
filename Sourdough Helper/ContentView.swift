import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            CalculatorView()
                .tabItem {
                    Label("Calculator", systemImage: "timer")
                }
            
            RecipesView()
                .tabItem {
                    Label("Recipes", systemImage: "book.fill")
                }
        }
        .tint(AppColors.primary)
    }
}

#Preview {
    ContentView()
}
