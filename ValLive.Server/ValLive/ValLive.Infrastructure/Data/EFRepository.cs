using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ValLive.Core.Common;
using ValLive.Core.Interfaces;

namespace ValLive.Infrastructure.Data
{
    public class EFRepository<TEntity, TKey> : IRepository<TEntity, TKey> where TEntity : Entity<TKey>
    {
        protected readonly DbContext _context;
        protected readonly DbSet<TEntity> _entities;
        public EFRepository(DbContext context)
        {
            _context = context;
            _entities = _context.Set<TEntity>();
        }
        public async Task AddAsync(TEntity entity)
        {
            await _entities.AddAsync(entity);
        }

        public async Task<IEnumerable<TEntity>> GetWhereAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await Task.FromResult<IEnumerable<TEntity>>(_entities.Where(predicate));
        }

        public async Task<TEntity?> GetAsync(TKey id)
        {
            return await _entities.FindAsync(id);
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await Task.FromResult<IEnumerable<TEntity>>(_entities);
        }

        public async Task RemoveAsync(TEntity entity)
        {
            await Task.FromResult(_entities.Remove(entity));
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
