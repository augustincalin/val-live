using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using BAMCIS.GeoJSON;
using Microsoft.Extensions.Options;
using ValLive.Core.Common;
using ValLive.Core.Interfaces;

namespace ValLive.Infrastructure.Data
{
    public class FileRepository<TEntity, TKey> : IRepository<TEntity, TKey> where TEntity : Entity<TKey>
    {
        private readonly StorageOptions _storageOptions;
        public FileRepository(IOptions<StorageOptions> storageOptions)
        {
            _storageOptions = storageOptions.Value;
        }
        public Task AddAsync(TEntity entity)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            string text = await File.ReadAllTextAsync(_storageOptions.FileName);
            var features = FeatureCollection.FromJson(text);
            return features.Features.Cast<TEntity>();
        }

        public async Task<TEntity?> GetAsync(TKey id)
        {
            var features = await GetAllAsync();
            return features.FirstOrDefault(x => x?.Id?.Equals(id) ?? false);
        }

        public Task<IEnumerable<TEntity>> GetWhereAsync(Expression<Func<TEntity, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task RemoveAsync(TEntity entity)
        {
            throw new NotImplementedException();
        }

        public Task SaveAsync()
        {
            throw new NotImplementedException();
        }
    }
}
