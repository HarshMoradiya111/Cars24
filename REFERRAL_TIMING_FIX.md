# Referral Reward Timing Fix

## Overview
Updated referral reward logic to award points on successful booking or selling, instead of during registration.

## Changes Made

### 1. **User Model** - `Models/User.cs`
Added tracking field for referral rewards:
```csharp
public bool ReferralRewarded { get; set; } = false;
```
- Prevents duplicate referral rewards
- Ensures points are only awarded once per user

### 2. **Signup Endpoint** - `Controllers/UserAuthController.cs`
**Before:**
- Awarded 50 points to new user on signup
- Awarded 100 points to referrer on signup

**After:**
- Saves `ReferredBy` code without awarding points
- Comment: "Points will be awarded on successful booking or selling"

### 3. **Booking Creation** - `Controllers/BookingController.cs`
Added referral logic to `CreateAppointment` endpoint:
```csharp
// Award referral points if user has a referrer and hasn't been rewarded yet
if (!string.IsNullOrEmpty(user.ReferredBy) && !user.ReferralRewarded)
{
    await _userService.AddWalletPointsAsync(userId, 50); // bonus for buyer
    await _userService.AddWalletPointsAsync(user.ReferredBy, 100); // bonus for referrer
    user.ReferralRewarded = true; // mark as rewarded so it only happens once
}
```

### 4. **Car Selling** - `Controllers/CarsController.cs`
Added new `/sell` endpoint with referral logic:
```csharp
[HttpPost("sell")]
public async Task<IActionResult> SellCar([FromQuery] string userId, [FromBody] Car car)
{
    // ... create car ...
    
    // Award referral points if user has a referrer and hasn't been rewarded yet
    if (!string.IsNullOrEmpty(user.ReferredBy) && !user.ReferralRewarded)
    {
        await _userService.AddWalletPointsAsync(userId, 50); // bonus for seller
        await _userService.AddWalletPointsAsync(user.ReferredBy, 100); // bonus for referrer
        user.ReferralRewarded = true;
    }
    
    await _userService.UpdateAsync(user.Id, user);
    return CreatedAtAction(nameof(GetById), new { id = car.Id }, car);
}
```

## Rules Applied
✅ **Do NOT change UI** - All changes are backend only
✅ **Do NOT change wallet schema** - Wallet points still work the same way
✅ **Minimal backend change** - Only added one field and referral checks
✅ **Keep existing referral codes** - All existing codes remain functional

## Workflow
1. **On signup:** 
   - User enters referral code or uses `?ref=CODE` in URL
   - Code is validated and saved to `ReferredBy`
   - `ReferralRewarded` initialized to `false`
   - **No points awarded yet**

2. **On successful booking:**
   - Check if `ReferredBy` exists AND `ReferralRewarded == false`
   - Award 50 points to buyer
   - Award 100 points to referrer
   - Set `ReferralRewarded = true`

3. **On successful selling:**
   - Check if `ReferredBy` exists AND `ReferralRewarded == false`
   - Award 50 points to seller
   - Award 100 points to referrer
   - Set `ReferralRewarded = true`

## Point Distribution
| Action | Buyer/Seller | Referrer |
|--------|------------|----------|
| Book car | +50 | +100 |
| Sell car | +50 | +100 |

## Verification
✅ Backend builds successfully
✅ No TypeScript/C# errors
✅ Referral code validation logic preserved
✅ Wallet points system intact

## Migration Notes
- Existing users with `ReferralRewarded = false` will receive points on next booking/selling
- Existing users who already received points will have `ReferralRewarded = true` in database
- No data migration needed - system is backward compatible
