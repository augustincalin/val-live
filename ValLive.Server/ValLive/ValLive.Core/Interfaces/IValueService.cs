using ValLive.Core.Model;

namespace ValLive.Core.Interfaces
{
    public interface IValueService
    {
        Task<Value> GetAValue(int id);
    }
}
