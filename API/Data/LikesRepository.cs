using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository : ILikesRepository
{
    private readonly DataContext _context;

    public LikesRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<UserLike> GetUserLike(int sourceUserId, int targetUserId)
    {
        return await _context.Likes.FindAsync(sourceUserId, targetUserId);
    }

    public void RemoveUserLike(UserLike userLike)
    {
        _context.Likes.Remove(userLike);
    }

    public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
    {
        var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
        var likes = _context.Likes.AsQueryable();

        if (likesParams.Predicate == "liked")
        {
            likes = likes.Where(like => like.SourceUserId == likesParams.UserId);
            users = likes.Select(like => like.TargetUser);
        }
        if (likesParams.Predicate == "likedBy")
        {
            likes = likes.Where(like => like.TargetUserId == likesParams.UserId);
            users = likes.Select(like => like.SourceUser);
        }
        var currentUser = await _context.Users.Include(u => u.LikedUsers).SingleOrDefaultAsync(u => u.Id == likesParams.UserId);
        var likedIds = currentUser?.LikedUsers.Select(l => l.TargetUserId).ToHashSet() ?? new HashSet<int>();

        var likedUsers = users.Select(user => new LikeDto
        {
            UserName = user.UserName,
            KnownAs = user.KnownAs,
            Age = user.DateOfBirth.CalculateAge(),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain).Url,
            City = user.City,
            Id = user.Id,
            LikedByCurrentUser = likedIds.Contains(user.Id)
        });

        return await PagedList<LikeDto>.CreateAsync(likedUsers, likesParams.pageNumber, likesParams.PageSize);
    }

    public async Task<AppUser> GetUserWithLikes(int userId)
    {
        return await _context.Users
            .Include(x => x.LikedByUsers)
            .FirstOrDefaultAsync(x => x.Id == userId);
    }
}