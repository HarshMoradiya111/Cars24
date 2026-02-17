using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Cars24API.Models;
using Cars24API.Services;

namespace Cars24API.Controllers
{
    [ApiController]
    [EnableCors("CorsPolicy")]
    [Route("api/servicebookings")]
    public class ServiceBookingController : ControllerBase
    {
        private readonly ServiceBookingService _serviceBookingService;
        private readonly UserService _userService;
        private readonly RedemptionService _redemptionService;

        public ServiceBookingController(ServiceBookingService serviceBookingService, UserService userService, RedemptionService redemptionService)
        {
            _serviceBookingService = serviceBookingService;
            _userService = userService;
            _redemptionService = redemptionService;
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

            if (booking.UseWallet && booking.DiscountUsed > 0)
            {
                var deductPoints = booking.DiscountUsed;
                var hadSuccess = await _userService.RedeemAsync(userId, deductPoints);
                
                if (!hadSuccess)
                {
                    return BadRequest("Failed to apply wallet discount. Insufficient points.");
                }

                var redemption = new Redemption
                {
                    UserId = userId,
                    PointsRedeemed = deductPoints,
                    RewardType = $"Service Booking - {booking.ServiceName}",
                    RedeemedAt = DateTime.UtcNow,
                    Status = "Completed"
                };
                await _redemptionService.CreateAsync(redemption);
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
