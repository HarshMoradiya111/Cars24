using Microsoft.AspNetCore.Mvc;
using Cars24API.Services;
using Cars24API.Models;

namespace Cars24API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PricingController : ControllerBase
    {
        private readonly PricingService _pricingService;
        public PricingController(PricingService pricingService)
        {
            _pricingService = pricingService;
        }

        public class PricingRequest
        {
            public string Title { get; set; } = string.Empty;
            public string BasePrice { get; set; } = string.Empty;
            public string? CarLocation { get; set; }
            public string? UserLocation { get; set; }
            public double? FuelIndex { get; set; }
            public DateTime? Date { get; set; }
        }

        [HttpPost("recommend")]
        public IActionResult Recommend([FromBody] PricingRequest req)
        {
            if (req == null || string.IsNullOrWhiteSpace(req.Title) || string.IsNullOrWhiteSpace(req.BasePrice))
            {
                return BadRequest("Title and BasePrice are required");
            }
            var ctx = new PricingContext
            {
                UserLocation = req.UserLocation,
                Date = req.Date ?? DateTime.UtcNow,
                FuelPriceIndex = req.FuelIndex
            };
            
            // Ensure BasePrice is properly formatted as a string for parsing
            string basePriceStr = req.BasePrice?.Trim() ?? "";
            var rec = _pricingService.Recommend(req.Title, basePriceStr, req.CarLocation, ctx);
            return Ok(new
            {
                RecommendedPrice = rec.RecommendedPrice,
                PricingNotes = rec.Notes
            });
        }
    }
}
