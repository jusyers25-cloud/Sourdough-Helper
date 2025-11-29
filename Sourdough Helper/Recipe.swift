import Foundation

struct Recipe: Identifiable, Codable {
    var id = UUID()
    var name: String
    var ingredients: String
    var instructions: String
    var notes: String
    var isFavorite: Bool = false
    var dateCreated: Date = Date()
}
