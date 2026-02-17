using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Cars24API.Services;
using Cars24API.Models;

namespace Cars24API.Controllers
{
    [ApiController]
    [EnableCors("CorsPolicy")]
    [Route("api/pricing")]
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
            var ctx = new PricingRules
            {
                UserLocation = req.UserLocation,
                Date = req.Date ?? DateTime.UtcNow,
                FuelPriceIndex = req.FuelIndex
            };
            var rec = _pricingService.Recommend(req.Title, req.BasePrice, req.CarLocation, ctx);
            return Ok(new
            {
                RecommendedPrice = rec.RecommendedPrice,
                PricingNotes = rec.Notes
            });
        }
    }
}
