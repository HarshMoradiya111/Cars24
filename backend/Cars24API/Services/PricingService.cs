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

        public PriceRecommendation Recommend(string title, string basePriceRaw, string? carLocation, PricingContext ctx)
        {
            var notes = new List<string>();
            var basePrice = ParsePrice(basePriceRaw);
            if (basePrice <= 0)
            {
                return new PriceRecommendation
                {
                    RecommendedPrice = Math.Max(basePrice, 0),
                    Notes = new List<string> { "Unable to parse base price; showing original." }
                };
            }

            var region = ClassifyRegion(ctx.UserLocation ?? carLocation);
            var bodyType = ClassifyBodyType(title);
            var date = ctx.Date ?? DateTime.UtcNow;
            var season = GetSeason(date, region);
            var fuelIndex = ctx.FuelPriceIndex ?? _config.GetSection("PricingRules").GetValue<double?>("FuelPriceIndex") ?? 1.0;
            var spikeThreshold = _config.GetSection("PricingRules").GetValue<double?>("FuelSpikeThreshold") ?? 1.1;

            decimal multiplier = 1.0m;
            // Monsoon or Hilly regions favor SUVs/offroad
            if (season == "Monsoon" || region == "Hilly")
            {
                if (bodyType == "SUV" || bodyType == "Offroad")
                {
                    multiplier *= 1.07m;
                    notes.Add("Seasonal/terrain demand: SUVs trending up in monsoon/hills (+7%).");
                }
                else if (bodyType == "Crossover")
                {
                    multiplier *= 1.03m;
                    notes.Add("Slight lift for crossovers in monsoon/hills (+3%).");
                }
            }

            // Fuel price spike negatively impacts hatchbacks in metro
            if (region == "Metro" && fuelIndex >= spikeThreshold)
            {
                if (bodyType == "Hatchback")
                {
                    multiplier *= 0.95m;
                    notes.Add("Fuel spike in metro: hatchbacks seeing softer demand (-5%).");
                }
            }

            // Small positive bump for rugged vehicles in rural
            if (region == "Rural" && (bodyType == "SUV" || bodyType == "Offroad"))
            {
                multiplier *= 1.02m;
                notes.Add("Rural preference: rugged vehicles slightly favored (+2%).");
            }

            var recommended = Decimal.Round(basePrice * multiplier, 0);

            // Add info notes
            notes.Add($"Region: {region}. Season: {season}. Body type: {bodyType}.");
            return new PriceRecommendation
            {
                RecommendedPrice = recommended,
                Notes = notes
            };
        }

        private static decimal ParsePrice(string? raw)
        {
            if (string.IsNullOrWhiteSpace(raw)) return 0m;
            // Accept formats like "₹7.80 lakh" or plain rupees with symbols
            var lower = raw.ToLowerInvariant();
            if (lower.Contains("lakh"))
            {
                var num = ExtractNumber(lower);
                return num.HasValue ? (decimal)num.Value * 100000m : 0m;
            }
            var digits = new string((raw ?? string.Empty).Where(char.IsDigit).ToArray());
            if (string.IsNullOrEmpty(digits)) return 0m;
            if (decimal.TryParse(digits, out var val)) return val;
            return 0m;
        }

        private static double? ExtractNumber(string input)
        {
            var s = new string(input.Where(c => char.IsDigit(c) || c == '.' ).ToArray());
            if (double.TryParse(s, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var d))
                return d;
            return null;
        }

        private static string ClassifyBodyType(string title)
        {
            var t = (title ?? string.Empty).ToLowerInvariant();
            if (t.Contains("suv") || t.Contains("xuv") || t.Contains("4x4") || t.Contains("thar") || t.Contains("offroad")) return "SUV";
            if (t.Contains("crossover") || t.Contains("nexon") || t.Contains("venue") || t.Contains("brezza") || t.Contains("creta")) return "Crossover";
            if (t.Contains("hatch") || t.Contains("swift") || t.Contains("baleno") || t.Contains("alto") || t.Contains("i10") || t.Contains("tiago")) return "Hatchback";
            if (t.Contains("sedan") || t.Contains("city") || t.Contains("ciaz") || t.Contains("verna") || t.Contains("dzire")) return "Sedan";
            return "Unknown";
        }

        private static string ClassifyRegion(string? location)
        {
            var l = (location ?? string.Empty).ToLowerInvariant();
            if (string.IsNullOrWhiteSpace(l)) return "Default";
            // Metro cities
            string[] metro = new[] { "delhi", "new delhi", "mumbai", "bangalore", "bengaluru", "chennai", "hyderabad", "pune", "kolkata" };
            if (metro.Any(c => l.Contains(c))) return "Metro";
            // Hilly regions examples
            string[] hilly = new[] { "shimla", "manali", "dehradun", "nainital", "mussoorie", "darjeeling", "munnar", "ooty" };
            if (hilly.Any(c => l.Contains(c))) return "Hilly";
            // Coastal
            string[] coastal = new[] { "goa", "kochi", "mangalore", "visakhapatnam", "puducherry", "pondicherry" };
            if (coastal.Any(c => l.Contains(c))) return "Coastal";
            // Rural fallback
            return "Rural";
        }

        private static string GetSeason(DateTime date, string region)
        {
            // Basic Indian seasons
            int m = date.Month;
            if (m >= 6 && m <= 9) return "Monsoon";
            if (m == 10 || m == 11) return "Post-Monsoon";
            if (m == 12 || m <= 2) return "Winter";
            return "Summer";
        }
    }
}
