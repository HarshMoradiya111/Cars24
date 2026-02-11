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
                    RecommendedPrice = 0,
                    Notes = new List<string> { "Invalid base price." }
                };
            }

            var region = ClassifyRegion(ctx.UserLocation ?? carLocation);
            var bodyType = ClassifyBodyType(title);
            var date = ctx.Date ?? DateTime.UtcNow;

            var fuelIndex = ctx.FuelPriceIndex ?? 1.0;
            var spikeThreshold = 1.1;

            decimal multiplier = 1.0m;

            if (IsMonsoon(date) || region == "Hilly")
            {
                if (bodyType == "SUV" || bodyType == "Offroad")
                {
                    multiplier *= 1.07m;
                    notes.Add("SUV demand higher in monsoon/hilly regions (+7%).");
                }
                else if (bodyType == "Crossover")
                {
                    multiplier *= 1.03m;
                    notes.Add("Crossover slight seasonal increase (+3%).");
                }
            }

            if (region == "Metro" && fuelIndex >= spikeThreshold)
            {
                if (bodyType == "Hatchback")
                {
                    multiplier *= 0.95m;
                    notes.Add("Fuel spike impact in metro (-5%).");
                }
            }

            if (region == "Rural" && (bodyType == "SUV" || bodyType == "Offroad"))
            {
                multiplier *= 1.02m;
                notes.Add("Rural preference boost (+2%).");
            }

            var recommended = Math.Round(basePrice * multiplier, 0);

            notes.Add($"Region: {region}. BodyType: {bodyType}.");

            return new PriceRecommendation
            {
                RecommendedPrice = recommended,
                Notes = notes
            };
        }

        private static bool IsMonsoon(DateTime date)
        {
            return date.Month >= 6 && date.Month <= 9;
        }

        private static string ClassifyBodyType(string title)
        {
            var t = (title ?? string.Empty).ToLowerInvariant();

            if (t.Contains("suv") || t.Contains("xuv") || t.Contains("thar") || t.Contains("4x4"))
                return "SUV";

            if (t.Contains("nexon") || t.Contains("venue") || t.Contains("brezza") || t.Contains("creta"))
                return "Crossover";

            if (t.Contains("swift") || t.Contains("baleno") || t.Contains("alto") || t.Contains("i10") || t.Contains("tiago"))
                return "Hatchback";

            if (t.Contains("city") || t.Contains("ciaz") || t.Contains("verna") || t.Contains("dzire"))
                return "Sedan";

            return "Unknown";
        }

        private static string ClassifyRegion(string? location)
        {
            var l = (location ?? string.Empty).ToLowerInvariant();

            if (string.IsNullOrWhiteSpace(l))
                return "Default";

            string[] metro = { "delhi", "mumbai", "bangalore", "bengaluru", "chennai", "hyderabad", "pune", "kolkata" };
            if (metro.Any(c => l.Contains(c)))
                return "Metro";

            string[] hilly = { "shimla", "manali", "dehradun", "nainital", "mussoorie", "darjeeling", "munnar", "ooty" };
            if (hilly.Any(c => l.Contains(c)))
                return "Hilly";

            return "Rural";
        }
    }
}