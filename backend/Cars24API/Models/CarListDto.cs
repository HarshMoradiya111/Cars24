using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cars24API.Models
{
    /// <summary>
    /// Lightweight DTO for car summaries - optimized for response size (~8KB per car)
    /// Essential fields only: Id, Brand, Model, Price, City, Year, KmDriven, MainImageUrl
    /// </summary>
    public class CarListDto
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        
        public string Brand { get; set; } = string.Empty;
        
        public string Model { get; set; } = string.Empty;
        
        public string Price { get; set; } = string.Empty;
        
        public string City { get; set; } = string.Empty;
        
        public int Year { get; set; }
        
        public string KmDriven { get; set; } = string.Empty;
        
        public string MainImageUrl { get; set; } = string.Empty;
    }
}

