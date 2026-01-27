using Microsoft.AspNetCore.Mvc;
using Cars24API.Models;
using Cars24API.Services;
using BCrypt.Net;

namespace Cars24API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserAuthController : ControllerBase
{
    private readonly UserService _userService;
    public UserAuthController(UserService userService)
    {
        _userService = userService;
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(string id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
            return NotFound("User not found.");

        return Ok(new
        {
            id = user.Id,
            fullName = user.FullName,
            email = user.Email,
            phone = user.Phone,
            referralCode = user.ReferralCode ?? string.Empty,
            walletPoints = user.WalletPoints,
            referredBy = user.ReferredBy
        });
    }
    [HttpPost("signup")]
    public async Task<IActionResult> Signup([FromBody] SignupRequest request)
    {
        var existingUser = await _userService.GetByEmailAsync(request.Email);
        if (existingUser != null)
            return BadRequest(new { message = "User already exists." });

        // Prepare new user
        var newUser = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            Phone = request.Phone,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            WalletPoints = 0
        };

        // Generate unique referral code
        newUser.ReferralCode = await _userService.GenerateUniqueReferralCodeAsync();

        // Apply referral if provided
        if (!string.IsNullOrWhiteSpace(request.ReferralCode))
        {
            var referrer = await _userService.GetByReferralCodeAsync(request.ReferralCode.Trim());
            if (referrer != null)
            {
                newUser.ReferredBy = referrer.Id;
                newUser.WalletPoints += 50; // bonus for new user
                if (!string.IsNullOrEmpty(referrer.Id))
                {
                    await _userService.AddWalletPointsAsync(referrer.Id, 100); // bonus for referrer
                }
            }
        }

        await _userService.CreateAsync(newUser);

        return Ok(new
        {
            message = "Signup successful",
            user = new
            {
                id = newUser.Id, // MongoDB-generated ObjectId
                fullName = newUser.FullName,
                email = newUser.Email,
                phone = newUser.Phone,
                referralCode = newUser.ReferralCode ?? string.Empty,
                walletPoints = newUser.WalletPoints,
                referredBy = newUser.ReferredBy
            }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _userService.GetByEmailAsync(request.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            return Unauthorized(new { message = "Invalid credentials" });

        return Ok(new
        {
            message = "Login successful",
            user = new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                phone = user.Phone,
                referralCode = user.ReferralCode ?? string.Empty,
                walletPoints = user.WalletPoints,
                referredBy = user.ReferredBy
            }
        });
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class SignupRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? ReferralCode { get; set; }
    }
}
