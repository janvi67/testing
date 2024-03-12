using System.ComponentModel.DataAnnotations.Schema;

using Microsoft.AspNetCore.SignalR;

using TestCoreApi.Models;

namespace TestCoreApi.Dtos
{
    [NotMapped]
    public class FamilyMemberDto
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public DateOnly BirthDate { get; set; }
        public string Relation { get; set; }
        public Guid UserId { get; set; }
        
    }
}
