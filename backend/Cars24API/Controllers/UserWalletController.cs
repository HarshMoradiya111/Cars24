using System;
using Cars24API.Models;
using Cars24API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Cars24API.Controllers;

[ApiController]
[Route("api/user")]
public class UserWalletController : ControllerBase
{
    private readonly UserService _userService;
    private readonly RedemptionService _redemptionService;
    private const int RedeemCost = 100;

    public UserWalletController(UserService userService, RedemptionService redemptionService)
    {
        _userService = userService;
        _redemptionService = redemptionService;
    }

    [HttpGet("{id}/wallet")]
    public async Task<IActionResult> GetWallet(string id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
        {
            return Ok(new { points = 0, message = "User not found" });
        }

        return Ok(new { points = user.WalletPoints });
    }

    [HttpPost("{id}/redeem")]
    public async Task<IActionResult> Redeem(string id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
        {
            return Ok(new { message = "User not found", points = 0 });
        }

        var success = await _userService.RedeemAsync(id, RedeemCost);
        if (!success)
        {
            return BadRequest(new { message = "Insufficient wallet points" });
        }

        // Log redemption
        var redemption = new Redemption
        {
            UserId = id,
            PointsRedeemed = RedeemCost,
            RewardType = "Discount Voucher",
            RedeemedAt = DateTime.UtcNow,
            Status = "Completed"
        };
        await _redemptionService.CreateAsync(redemption);

        var updated = await _userService.GetByIdAsync(id);
        var points = updated?.WalletPoints ?? Math.Max(0, user.WalletPoints - RedeemCost);
        return Ok(new { message = "Redeemed successfully", points });
    }

    [HttpGet("{id}/redemptions")]
    public async Task<IActionResult> GetRedemptions(string id)
    {
        var redemptions = await _redemptionService.GetByUserIdAsync(id);
        return Ok(redemptions);
    }
}
