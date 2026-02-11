using Cars24API.Models;
using Microsoft.Extensions.Configuration;

namespace Cars24API.Services
{
    public class PricingService
    {
        private readonly IConfiguration _config;

        public PricingService(IConfiguration config)
        {
            _config = config;
        }

        public PriceRecommendation Recommend(string title, decimal basePrice, string? carLocation, PricingContext ctx)
        {
            var notes = new List<string>();

            if (basePrice <= 0)
            {
                return new PriceRecommendation
                {
                    RecommendedPrice = basePrice,
                    Notes = new List<string> { "Invalid base price." }
                };
            }

            var region = ClassifyRegion(ctx.UserLocation ?? carLocation);
            var bodyType = ClassifyBodyType(title);
            var date = ctx.Date ?? DateTime.UtcNow;

            var fuelIndex = ctx.FuelPriceIndex ?? 1.0;
            var spikeThreshold = 1.1;

            decimal multiplier = 1.0m;

            if (region == "Metro" && fuelIndex >= spikeThreshold && bodyType == "Hatchback")
            {
                multiplier *= 0.95m;
                notes.Add("Fuel spike impact in metro (-5%).");
            }

            if (region == "Rural" && (bodyType == "SUV" || bodyType == "Offroad"))
            {
                multiplier *= 1.02m;
                notes.Add("Rural demand boost (+2%).");
            }

            var recommended = decimal.Round(basePrice * multiplier, 0);

            notes.Add($"Region: {region}. Body type: {bodyType}.");

            return new PriceRecommendation
            {
                RecommendedPrice = recommended,
                Notes = notes
            };
        }

        private static string ClassifyBodyType(string title)
        {
            var t = (title ?? "").ToLower();

            if (t.Contains("suv") || t.Contains("xuv") || t.Contains("thar")) return "SUV";
            if (t.Contains("swift") || t.Contains("baleno") || t.Contains("alto")) return "Hatchback";
            if (t.Contains("city") || t.Contains("ciaz") || t.Contains("verna")) return "Sedan";

            return "Unknown";
        }

        private static string ClassifyRegion(string? location)
        {
            var l = (location ?? "").ToLower();

            string[] metro = { "delhi", "mumbai", "bangalore", "chennai", "hyderabad" };

            if (metro.Any(c => l.Contains(c))) return "Metro";

            return "Rural";
        }
    }
}