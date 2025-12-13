using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AdminController : BaseApiController
{
    private readonly UserManager<AppUser> _userManager;

    public AdminController(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = await _userManager.Users
            .OrderBy(u => u.UserName)
            .Select(u => new
            {
                u.Id,
                u.UserName,
                Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
            })
            .ToListAsync();

        return Ok(users);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("edit-roles/{userName}")]
    public async Task<ActionResult> EditRoles(string userName, [FromQuery] string roles)
    {
        if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role");
        var user = await _userManager.FindByNameAsync(userName);
        if (user == null) return NotFound();

        var selectedRoles = roles.Split(',').ToArray();
        var userRoles = await _userManager.GetRolesAsync(user);

        var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
        if (!result.Succeeded) return BadRequest("Failed to add roles");

        result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
        if (!result.Succeeded) return BadRequest("Failed to remove roles");

        return Ok(await _userManager.GetRolesAsync(user));
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("update-user/{currentUserName}")]
    public async Task<ActionResult> UpdateUser(string currentUserName, [FromBody] UpdateUserDto updateUserDto)
    {
        var trimmedCurrentUserName = (currentUserName ?? string.Empty).Trim();
        var normalizedCurrentUserName = _userManager.NormalizeName(trimmedCurrentUserName);

        var user = await _userManager.Users.SingleOrDefaultAsync(u =>
            u.NormalizedUserName == normalizedCurrentUserName || u.UserName == trimmedCurrentUserName);
        if (user == null) return NotFound("User not found");

        // Check if new username already exists
        var trimmedNewUserName = (updateUserDto.NewUserName ?? string.Empty).Trim();
        if (!string.IsNullOrEmpty(trimmedNewUserName) && trimmedNewUserName != trimmedCurrentUserName)
        {
            var normalizedNewUserName = _userManager.NormalizeName(trimmedNewUserName);
            var usernameTaken = await _userManager.Users.AnyAsync(u =>
                (u.NormalizedUserName == normalizedNewUserName || u.UserName == trimmedNewUserName) && u.Id != user.Id);
            if (usernameTaken) return BadRequest("Username already taken");

            var setUserNameResult = await _userManager.SetUserNameAsync(user, trimmedNewUserName.ToLower());
            if (!setUserNameResult.Succeeded) return BadRequest(setUserNameResult.Errors);
        }

        // Change password using ResetPasswordAsync (admin doesn't need current password)
        if (!string.IsNullOrEmpty(updateUserDto.NewPassword))
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, updateUserDto.NewPassword);
            if (!result.Succeeded) return BadRequest(result.Errors);
        }

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded) return BadRequest(updateResult.Errors);

        return Ok(new { message = "User updated successfully" });
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public ActionResult GetPhotosForModeration()
    {
        return Ok("Admins or moderators can see this");
    }
}