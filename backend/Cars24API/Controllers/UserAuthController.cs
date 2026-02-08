using Microsoft.AspNetCore.Mvc;
using Cars24API.Models;
using Cars24API.Services;
using BCrypt.Net;
using System.Security.Cryptography;
using System.Text;

namespace Cars24API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserAuthController : ControllerBase
{
    private readonly UserService _userService;
    private readonly EmailService _emailService;
    private readonly IConfiguration _config;

    public UserAuthController(UserService userService, EmailService emailService, IConfiguration config)
    {
        _userService = userService;
        _emailService = emailService;
        _config = config;
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

        // Save referral code if provided (but don't award points yet)
        if (!string.IsNullOrWhiteSpace(request.ReferralCode))
        {
            var referrer = await _userService.GetByReferralCodeAsync(request.ReferralCode.Trim());
            if (referrer != null)
            {
                newUser.ReferredBy = referrer.Id;
                // Points will be awarded on successful booking or selling
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

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest(new { message = "Email is required." });

        var user = await _userService.GetByEmailAsync(request.Email.Trim());
        if (user == null)
        {
            return Ok(new { message = "If an account exists, a reset link has been sent." });
        }

        var token = GenerateSecureToken();
        var tokenHash = HashToken(token);
        var expiryUtc = DateTime.UtcNow.AddHours(1);

        await _userService.SetResetTokenAsync(user.Id!, tokenHash, expiryUtc);

        var baseUrl = _config["Frontend:BaseUrl"] ?? "http://localhost:3000";
        var resetLink = $"{baseUrl.TrimEnd('/')}/reset-password?token={Uri.EscapeDataString(token)}";

        await _emailService.SendPasswordResetEmailAsync(user.Email, resetLink);

        return Ok(new { message = "If an account exists, a reset link has been sent." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Token) || string.IsNullOrWhiteSpace(request.NewPassword))
            return BadRequest(new { message = "Token and new password are required." });

        var tokenHash = HashToken(request.Token);
        var user = await _userService.GetByResetTokenHashAsync(tokenHash);
        if (user == null)
            return BadRequest(new { message = "Invalid or expired token." });

        if (user.ResetTokenExpiry == null || user.ResetTokenExpiry < DateTime.UtcNow)
        {
            await _userService.ClearResetTokenAsync(user.Id!);
            return BadRequest(new { message = "Invalid or expired token." });
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _userService.UpdatePasswordAndClearResetAsync(user.Id!, passwordHash);

        return Ok(new { message = "Password reset successful." });
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

    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordRequest
    {
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    private static string GenerateSecureToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        return Base64UrlEncode(bytes);
    }

    private static string HashToken(string token)
    {
        using var sha = SHA256.Create();
        var hashBytes = sha.ComputeHash(Encoding.UTF8.GetBytes(token));
        return Convert.ToBase64String(hashBytes);
    }

    private static string Base64UrlEncode(byte[] input)
    {
        return Convert.ToBase64String(input)
            .Replace("+", "-")
            .Replace("/", "_")
            .TrimEnd('=');
    }
}
