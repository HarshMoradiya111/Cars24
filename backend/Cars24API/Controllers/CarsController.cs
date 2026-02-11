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
            if (car == null)
                return NotFound();

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
            var cars = await _carservice.GetSummariesOptimizedAsync();

            var result = cars.Select(car => new
            {
                car.Id,
                car.Brand,
                car.Model,
                car.Price,
                car.City,
                car.Year,
                car.KmDriven,
                car.MainImageUrl,
                RecommendedPrice = _pricingService.Recommend($"{car.Brand} {car.Model}", car.Price, car.City, new PricingContext
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
                return BadRequest();

            await _carservice.CreateAsync(car);
            return CreatedAtAction(nameof(GetById), new { id = car.Id }, car);
        }

        [HttpPost("sell")]
        public async Task<IActionResult> SellCar([FromQuery] string userId, [FromBody] Car car)
        {
            if (car == null || string.IsNullOrEmpty(userId))
                return BadRequest();

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return NotFound();

            await _carservice.CreateAsync(car);

            if (!string.IsNullOrEmpty(user.ReferredBy) && !user.ReferralRewarded)
            {
                await _userService.AddWalletPointsAsync(userId, 1000);
                await _userService.AddWalletPointsAsync(user.ReferredBy, 1000);
                await _userService.MarkReferralRewardedAsync(userId);
            }

            return CreatedAtAction(nameof(GetById), new { id = car.Id }, car);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var car = await _carservice.GetByIdAsync(id);
            if (car == null)
                return NotFound();

            await _carservice.DeleteAsync(id);
            return Ok();
        }

        [HttpPost("remove-duplicates")]
        public async Task<IActionResult> RemoveDuplicates()
        {
            var deletedCount = await _carservice.RemoveDuplicatesAsync();
            return Ok(new { deletedCount });
        }
    }
}