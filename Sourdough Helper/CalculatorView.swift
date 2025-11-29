import SwiftUI

struct CalculatorView: View {
    @State private var temperature: Double = 70
    @State private var starterStrength: Double = 50
    @State private var doughWeight: Double = 1000
    
    var body: some View {
        NavigationView {
            ZStack {
                AppColors.background.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Header
                        VStack(spacing: 8) {
                            Image(systemName: "clock.fill")
                                .font(.system(size: 50))
                                .foregroundColor(AppColors.secondary)
                            
                            Text("Fermentation Timer")
                                .font(.title2)
                                .fontWeight(.bold)
                                .foregroundColor(AppColors.primary)
                            
                            Text("Calculate your wait time")
                                .font(.subheadline)
                                .foregroundColor(AppColors.secondary)
                        }
                        .padding(.top, 20)
                        
                        // Input Cards
                        VStack(spacing: 16) {
                            InputCard(
                                title: "Room Temperature",
                                value: $temperature,
                                range: 60...85,
                                unit: "°F",
                                icon: "thermometer",
                                description: "Warmer = faster rise"
                            )
                            
                            InputCard(
                                title: "Starter Strength",
                                value: $starterStrength,
                                range: 0...100,
                                unit: "%",
                                icon: "chart.line.uptrend.xyaxis",
                                description: "How active is your starter?"
                            )
                            
                            InputCard(
                                title: "Dough Weight",
                                value: $doughWeight,
                                range: 200...2000,
                                unit: "g",
                                icon: "scalemass.fill",
                                description: "Total dough weight"
                            )
                        }
                        
                        // Results Card
                        ResultCard(
                            bulkFermentTime: calculateBulkFerment(),
                            proofTime: calculateProof()
                        )
                    }
                    .padding()
                }
            }
            .navigationBarHidden(true)
        }
    }
    
    // Calculation formulas
    func calculateBulkFerment() -> Double {
        // Base time at 70°F with 50% strength: 4 hours
        let baseTime = 4.0
        
        // Temperature adjustment: warmer = faster
        let tempFactor = pow(1.15, (70 - temperature) / 5)
        
        // Starter strength adjustment: stronger = faster
        let strengthFactor = 100.0 / (starterStrength + 50)
        
        // Size adjustment: larger = slightly longer
        let sizeFactor = 1.0 + ((doughWeight - 1000) / 5000)
        
        return baseTime * tempFactor * strengthFactor * sizeFactor
    }
    
    func calculateProof() -> Double {
        // Proof time is typically 2-4 hours, affected by same factors
        let baseTime = 3.0
        let tempFactor = pow(1.15, (70 - temperature) / 5)
        let strengthFactor = 100.0 / (starterStrength + 50)
        
        return baseTime * tempFactor * strengthFactor
    }
}

struct InputCard: View {
    let title: String
    @Binding var value: Double
    let range: ClosedRange<Double>
    let unit: String
    let icon: String
    let description: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(AppColors.secondary)
                    .font(.title3)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.headline)
                        .foregroundColor(AppColors.primary)
                    
                    Text(description)
                        .font(.caption)
                        .foregroundColor(AppColors.secondary)
                }
                
                Spacer()
                
                Text("\(Int(value))\(unit)")
                    .font(.title3)
                    .fontWeight(.semibold)
                    .foregroundColor(AppColors.primary)
                    .frame(width: 80, alignment: .trailing)
            }
            
            Slider(value: $value, in: range)
                .tint(AppColors.accent)
        }
        .padding()
        .background(AppColors.card)
        .cornerRadius(16)
        .shadow(color: AppColors.primary.opacity(0.1), radius: 8, x: 0, y: 4)
    }
}

struct ResultCard: View {
    let bulkFermentTime: Double
    let proofTime: Double
    
    var body: some View {
        VStack(spacing: 20) {
            HStack {
                Image(systemName: "hourglass")
                    .font(.title2)
                    .foregroundColor(AppColors.primary)
                
                Text("Your Timeline")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(AppColors.primary)
                
                Spacer()
            }
            
            Divider()
                .background(AppColors.light)
            
            TimeResultRow(
                label: "Bulk Fermentation",
                time: bulkFermentTime,
                icon: "1.circle.fill",
                color: AppColors.secondary
            )
            
            TimeResultRow(
                label: "Final Proof",
                time: proofTime,
                icon: "2.circle.fill",
                color: AppColors.accent
            )
            
            Divider()
                .background(AppColors.light)
            
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Total Time")
                        .font(.headline)
                        .foregroundColor(AppColors.primary)
                    
                    Text("From mix to bake")
                        .font(.caption)
                        .foregroundColor(AppColors.secondary)
                }
                
                Spacer()
                
                Text(formatTotalTime(bulkFermentTime + proofTime))
                    .font(.title)
                    .fontWeight(.bold)
                    .foregroundColor(AppColors.primary)
            }
        }
        .padding()
        .background(
            LinearGradient(
                gradient: Gradient(colors: [AppColors.card, AppColors.background]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(16)
        .shadow(color: AppColors.primary.opacity(0.15), radius: 12, x: 0, y: 6)
    }
    
    func formatTotalTime(_ hours: Double) -> String {
        let h = Int(hours)
        let m = Int((hours - Double(h)) * 60)
        return "\(h)h \(m)m"
    }
}

struct TimeResultRow: View {
    let label: String
    let time: Double
    let icon: String
    let color: Color
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(color)
            
            Text(label)
                .font(.body)
                .foregroundColor(AppColors.primary)
            
            Spacer()
            
            Text(formatTime(time))
                .font(.title3)
                .fontWeight(.semibold)
                .foregroundColor(color)
        }
    }
    
    func formatTime(_ hours: Double) -> String {
        let h = Int(hours)
        let m = Int((hours - Double(h)) * 60)
        if h > 0 {
            return "\(h)h \(m)m"
        } else {
            return "\(m)m"
        }
    }
}

#Preview {
    CalculatorView()
}
