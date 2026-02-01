using Microsoft.AspNetCore.Mvc;
using Cars24API.Models;
using Cars24API.Services;

namespace Cars24API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServiceBookingController : ControllerBase
    {
        private readonly ServiceBookingService _serviceBookingService;
        private readonly UserService _userService;

        public ServiceBookingController(ServiceBookingService serviceBookingService, UserService userService)
        {
            _serviceBookingService = serviceBookingService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateServiceBooking([FromQuery] string userId, [FromBody] ServiceBooking booking)
        {
            if (booking == null || string.IsNullOrEmpty(userId))
                return BadRequest("UserId is not present");

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");

            booking.UserId = userId;
            await _serviceBookingService.CreateAsync(booking);

            // If wallet was used, deduct the discount points from wallet
            if (booking.UseWallet && booking.DiscountUsed > 0)
            {
                // Deduct points from user's wallet
                var deductPoints = booking.DiscountUsed;
                var hadSuccess = await _userService.RedeemAsync(userId, deductPoints);
                
                if (!hadSuccess)
                {
                    return BadRequest("Failed to apply wallet discount. Insufficient points.");
                }
            }

            return CreatedAtAction(nameof(GetServiceBookingById), new { id = booking.Id }, booking);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetServiceBookingById(string id)
        {
            var booking = await _serviceBookingService.GetByIdAsync(id);
            if (booking == null)
                return NotFound("Service booking not found");

            return Ok(booking);
        }

        [HttpGet("user/{userId}/bookings")]
        public async Task<IActionResult> GetServiceBookingsByUserId(string userId)
        {
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");

            var bookings = await _serviceBookingService.GetByUserIdAsync(userId);
            return Ok(bookings);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllServiceBookings()
        {
            var bookings = await _serviceBookingService.GetAllAsync();
            return Ok(bookings);
        }
    }
}
