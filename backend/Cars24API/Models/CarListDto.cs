namespace Cars24API.Models;

public class CarListDto
{
    public string Id { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string City { get; set; } = string.Empty;
    public int Year { get; set; }
    public string KmDriven { get; set; } = string.Empty;
    public string MainImageUrl { get; set; } = string.Empty;
}