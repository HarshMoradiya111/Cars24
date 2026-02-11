using Microsoft.AspNetCore.Mvc;
using Cars24API.Models;
using Cars24API.Services;

namespace Cars24API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarController : ControllerBase
    {
        private readonly CarService _carservice;
        private readonly PricingService _pricingService;
        private readonly UserService _userService;

        public CarController(CarService carService, PricingService pricingService, UserService userService)
        {
            _carservice = carService;
            _pricingService = pricingService;
            _userService = userService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id, [FromQuery] string? userLocation = null, [FromQuery] double? fuelIndex = null)
        {
            var car = await _carservice.GetByIdAsync(id);
            if (car == null) return NotFound();

            var ctx = new PricingContext
            {
                UserLocation = userLocation,
                Date = DateTime.UtcNow,
                FuelPriceIndex = fuelIndex
            };

            var rec = _pricingService.Recommend(car.Title, car.Price, car.Location, ctx);

            return Ok(new
            {
                car.Id,
                car.Title,
                car.Images,
                car.Price,
                car.Emi,
                car.Location,
                car.Specs,
                car.Features,
                car.Highlights,
                RecommendedPrice = rec.RecommendedPrice,
                PricingNotes = rec.Notes
            });
        }

        [HttpGet("summaries")]
        public async Task<IActionResult> GetCarsummaries([FromQuery] string? userLocation = null, [FromQuery] double? fuelIndex = null)
        {
            var cars = await _carservice.GetSummariesOptimizedAsync();

            var result = cars.Select(car =>
            {
                var rec = _pricingService.Recommend(
                    $"{car.Brand} {car.Model}",
                    car.Price,
                    car.City,
                    new PricingContext
                    {
                        UserLocation = userLocation,
                        Date = DateTime.UtcNow,
                        FuelPriceIndex = fuelIndex
                    });

                return new
                {
                    car.Id,
                    car.Brand,
                    car.Model,
                    car.Price,
                    car.City,
                    car.Year,
                    car.KmDriven,
                    car.MainImageUrl,
                    RecommendedPrice = rec.RecommendedPrice
                };
            });

            return Ok(result);
        }
    }
}