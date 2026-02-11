using Microsoft.AspNetCore.Mvc;
using Cars24API.Models;
using Cars24API.Services;

namespace Cars24API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PricingController : ControllerBase
    {
        private readonly PricingService _pricingService;
        private readonly CarService _carService;

        public PricingController(PricingService pricingService, CarService carService)
        {
            _pricingService = pricingService;
            _carService = carService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecommendedPrice(string id,
            [FromQuery] string? userLocation = null,
            [FromQuery] double? fuelIndex = null)
        {
            var car = await _carService.GetByIdAsync(id);

            if (car == null)
                return NotFound();

            var ctx = new PricingContext
            {
                UserLocation = userLocation,
                Date = DateTime.UtcNow,
                FuelPriceIndex = fuelIndex
            };

            var recommendation = _pricingService.Recommend(
                car.Title,
                car.Price,
                car.Location,
                ctx
            );

            return Ok(recommendation);
        }
    }
}