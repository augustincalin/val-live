using Microsoft.EntityFrameworkCore;
using ValLive.Core.Model;

namespace ValLive.Infrastructure
{
    /*
     * You would want to generate the model from an existing database via scaffolding.
     * Then move the entities into ValLive.Core project and keep here the DbContext.
     * See https://docs.microsoft.com/en-us/ef/core/managing-schemas/scaffolding?tabs=dotnet-core-cli
     */
    public class OnionContext : DbContext
    {
        public OnionContext(DbContextOptions<OnionContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Value> Values { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Value>(entity => { entity.ToTable("Values"); });
        }
    }
}
