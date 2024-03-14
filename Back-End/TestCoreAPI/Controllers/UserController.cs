using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using TestCoreApi.Data;
using TestCoreApi.Models;

namespace TestCoreApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly ContactsAPIDbContext dbContext;
        public UserController(ContactsAPIDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> AddUsers()
        {
            return Ok(await dbContext.Users.ToListAsync());
        }

        [HttpGet]
        [Route("GetUserName{email}")]
        public async Task<IActionResult> GetUserName(string email)
        {
            try
            {
                // Assuming you have a User table/entity with a Name property
                var user = await dbContext.Users.FirstOrDefaultAsync(u=> u.Email == email);

                if (user != null)
                {
                    return Ok(new { id = user.Id, name = user.Name, birthday =user.BirthDate });
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(UserDto loginUserDto)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == loginUserDto.Email && u.Password == loginUserDto.Password);
            if (user != null)
            {
                return Ok(new { email = user.Email, password = user.Password }); // Return user's email and password
            }
            else
            {
                return Unauthorized("Invalid email or password");
            }
        }

        [HttpPost]
        [Route("addUser")]
        public async Task<ActionResult<User>> AddUser(UserDto addUserDto)
        {
            var existingUser = await dbContext.Users.Where(u => u.Email == addUserDto.Email).FirstOrDefaultAsync();
            if (existingUser == null)
            {
                var user = new User()
                {
                    Id = Guid.NewGuid(),
                    Name = addUserDto.Name,
                    Email = addUserDto.Email,
                    BirthDate = addUserDto.BirthDate,
                    Password = addUserDto.Password
                };

                await dbContext.Users.AddAsync(user);
                await dbContext.SaveChangesAsync();
                return Ok("User Created.");
            }
            return Ok("User Already Registered!");
            //return Conflict("User with this email already exists"); // Return conflict status if user already exists
        }

        [HttpPut]
        [Route("UpdateUser/{email}")]
        public async Task<IActionResult> UpdateUser([FromRoute] string email, [FromBody] UserDto updateUserData)
        {
            try
            {
                var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user == null)
                {
                    return NotFound();
                }
                user.Name = updateUserData.Name;
                user.Gender = updateUserData.Gender;
                user.BirthDate = updateUserData.BirthDate;
                user.MobileNumber = updateUserData.MobileNumber;

                await dbContext.SaveChangesAsync();
                return Ok(user);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }
       //demo  for commit in github


        [HttpPut]
        [Route("ChangePassword")]
        public async Task<IActionResult> ChangePassword(UserDto changePassword)
        {
            var existingUser = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == changePassword.Email && u.BirthDate == changePassword.BirthDate);

            if (existingUser == null)
            {
                return Ok("Email or BirthDate not Exist");
            }
            //comment
            existingUser.Password = changePassword.Password;
            await dbContext.SaveChangesAsync();

            return Ok("Password updated successfully");
        }   
    }
}
