using API.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly DataContext _dbContext;
    private readonly IMapper _mapper;

    public UnitOfWork(DataContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public IUserRepository UserRepository => new UserRepository(_dbContext, _mapper);

    public IMessageRepository MessageRepository => new MessageRepository(_dbContext, _mapper);

    public ILikesRepository LikesRepository => new LikesRepository(_dbContext);

    public async Task<bool> Complete()
    {
        return await _dbContext.SaveChangesAsync() > 0;
    }

    public bool HasChanges()
    {
        return _dbContext.ChangeTracker.HasChanges();
    }
}