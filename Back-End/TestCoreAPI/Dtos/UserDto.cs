using System.ComponentModel.DataAnnotations.Schema;

namespace TestCoreApi.Models
{
    [NotMapped]
    public class UserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Gender { get; set; }
        public DateOnly BirthDate { get; set; }
        public long MobileNumber { get; set; }

    }
}
