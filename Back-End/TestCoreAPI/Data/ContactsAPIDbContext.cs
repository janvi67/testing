using Microsoft.EntityFrameworkCore;
using TestCoreApi.Models;

namespace TestCoreApi.Data
{
    public class ContactsAPIDbContext : DbContext
    {
        public ContactsAPIDbContext(DbContextOptions<ContactsAPIDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<FamilyMember> FamilyMembers { get; set; }

    }
}
