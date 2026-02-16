namespace Cars24API.Models;

public class PriceRecommendationDto
{
    public decimal RecommendedPrice { get; set; }
    public List<string> Notes { get; set; } = new List<string>();
}
