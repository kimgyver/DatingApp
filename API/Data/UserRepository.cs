using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UserRepository : IUserRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public UserRepository(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<MemberDto> GetMemberAsync(string userName)
    {
        var member = await _context.Users
            .Include(u => u.LikedByUsers)
            .Where(x => x.UserName == userName)
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();

        // 현재 로그인한 사용자의 username을 HttpContext에서 가져와야 함 (Service 계층에서 처리 필요)
        // 여기서는 임시로 false로 둠
        member.LikedByCurrentUser = false;
        return member;
    }

    public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
    {
        var query = _context.Users.Include(u => u.LikedByUsers).AsQueryable();
        query = query.Where(u => u.UserName != userParams.CurrentUsername); // exclude user
        query = query.Where(u => u.Gender == userParams.Gender);    // only opposite gender

        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));

        query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

        query = userParams.OrderBy switch
        {
            "created" => query.OrderByDescending(u => u.Created),
            _ => query.OrderByDescending(u => u.LastActive)
        };

        var membersQuery = query
            .AsNoTracking()
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider);

        // 페이징 처리 추가
        var pagedMembers = await membersQuery
            .Skip((userParams.pageNumber - 1) * userParams.PageSize)
            .Take(userParams.PageSize)
            .ToListAsync();

        // 현재 로그인한 사용자의 id를 구해서, 각 member가 LikedByCurrentUser인지 체크
        var currentUser = await _context.Users.Include(u => u.LikedUsers).SingleOrDefaultAsync(u => u.UserName == userParams.CurrentUsername);
        var likedIds = currentUser?.LikedUsers.Select(l => l.TargetUserId).ToHashSet() ?? new HashSet<int>();
        foreach (var m in pagedMembers)
        {
            m.LikedByCurrentUser = likedIds.Contains(m.Id);
        }

        return new PagedList<MemberDto>(
            pagedMembers, membersQuery.Count(), userParams.pageNumber, userParams.PageSize);
    }

    public async Task<AppUser> GetUserByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<AppUser> GetUserByUsernameAsync(string userName)
    {
        return await _context.Users.Include(p => p.Photos).SingleOrDefaultAsync(x => x.UserName == userName);
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await _context.Users
            .Include(p => p.Photos)
            .ToListAsync();
    }

    // public async Task<bool> SaveAllAsync()
    // {
    //     return await _context.SaveChangesAsync() > 0;
    // }

    public void Update(AppUser user)
    {
        _context.Entry(user).State = EntityState.Modified;
    }
}