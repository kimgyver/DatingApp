using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController : BaseApiController
{
    private readonly IUnitOfWork _uow;
    public LikesController(IUnitOfWork uow)
    {
        _uow = uow;
    }

    [HttpPost("{userName}")]
    public async Task<IActionResult> ToggleLike(string userName)
    {
        var sourceUserId = User.GetUserId();
        var likedUser = await _uow.UserRepository.GetUserByUsernameAsync(userName);
        var sourceUser = await _uow.LikesRepository.GetUserWithLikes(sourceUserId);

        if (likedUser == null) return NotFound();

        if (sourceUser.UserName == userName) return BadRequest("You cannot like yourself");

        var userLike = await _uow.LikesRepository.GetUserLike(sourceUserId, likedUser.Id);

        if (userLike != null)
        {
            // 이미 좋아요한 경우: 좋아요 취소(삭제)
            sourceUser.LikedUsers.Remove(userLike);
            _uow.LikesRepository.RemoveUserLike(userLike);
            if (await _uow.Complete()) return Ok(new { liked = false });
            return BadRequest("Failed to unlike user");
        }

        // 좋아요 추가
        userLike = new UserLike
        {
            SourceUserId = sourceUserId,
            TargetUserId = likedUser.Id
        };

        sourceUser.LikedUsers.Add(userLike);

        if (await _uow.Complete()) return Ok(new { liked = true });

        return BadRequest("Failed to like user");
    }

    [HttpGet]
    public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery] LikesParams likesParams)
    {
        likesParams.UserId = User.GetUserId();
        var users = await _uow.LikesRepository.GetUserLikes(likesParams);
        Response.AddPaginationHeader(new PaginationHeader
        {
            CurrentPage = users.CurrentPage,
            ItemsPerPage = users.PageSize,
            TotalItems = users.TotalCount,
            TotalPages = users.TotalPages
        });
        return Ok(users);
    }
}