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
        public CarController(CarService carService, PricingService pricingService)
        {
            _carservice = carService;
            _pricingService = pricingService;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id, [FromQuery] string? userLocation = null, [FromQuery] double? fuelIndex = null)
        {
            var car = await _carservice.GetByIdAsync(id);
            if (car == null)
            {
                return NotFound();
            }
            var ctx = new Cars24API.Models.PricingContext
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
                Specs = car.Specs,
                Features = car.Features,
                Highlights = car.Highlights,
                RecommendedPrice = rec.RecommendedPrice,
                PricingNotes = rec.Notes
            });
        }
        [HttpGet("summaries")]
        public async Task<IActionResult> GetCarsummaries([FromQuery] string? userLocation = null, [FromQuery] double? fuelIndex = null)
        {
            var cars = await _carservice.GetAllAsync();
            var result = cars.Select(car => new
            {
                car.Id,
                car.Title,
                km = car.Specs.Km,
                Fuel = car.Specs.Fuel,
                Transmission = car.Specs.Transmission,
                Owner = car.Specs.Owner,
                car.Emi,
                car.Price,
                car.Location,
                image = (car.Images != null && car.Images.Count > 0) ? car.Images[0] : string.Empty,
                RecommendedPrice = _pricingService.Recommend(car.Title, car.Price, car.Location, new Cars24API.Models.PricingContext
                {
                    UserLocation = userLocation,
                    Date = DateTime.UtcNow,
                    FuelPriceIndex = fuelIndex
                }).RecommendedPrice
            });
            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Car car)
        {
            if (car == null)
            {
                return BadRequest("Car data is required");
            }
            await _carservice.CreateAsync(car);
            return CreatedAtAction(nameof(GetById), new { id = car.Id }, car);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var car = await _carservice.GetByIdAsync(id);
            if (car == null)
            {
                return NotFound("Car not found");
            }
            await _carservice.DeleteAsync(id);
            return Ok(new { message = "Car deleted successfully" });
        }

        [HttpPost("remove-duplicates")]
        public async Task<IActionResult> RemoveDuplicates()
        {
            var deletedCount = await _carservice.RemoveDuplicatesAsync();
            return Ok(new { message = $"Removed {deletedCount} duplicate cars" });
        }
    }
}
