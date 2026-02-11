using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cars24API.Models;

public class Specs
{
    public int Year { get; set; }
    public string Km { get; set; } = string.Empty;
    public string Fuel { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;
    public string Owner { get; set; } = string.Empty;
    public string Insurance { get; set; } = string.Empty;
}

public class Car
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public List<string> Images { get; set; } = new();
    public string Title { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal Emi { get; set; }
    public string Location { get; set; } = string.Empty;
    public Specs Specs { get; set; } = new();
    public List<string> Features { get; set; } = new();
    public List<string> Highlights { get; set; } = new();
}