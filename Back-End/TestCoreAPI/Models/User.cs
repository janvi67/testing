namespace TestCoreApi.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string? Gender { get; set; }
        public DateOnly? BirthDate { get; set; }
        public long? MobileNumber { get; set; }
        public virtual ICollection<FamilyMember> FamilyMembers { get; set; }
    }
}
