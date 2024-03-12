using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using TestCoreApi.Data;
using TestCoreApi.Dtos;
using TestCoreApi.Models;

namespace TestCoreApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FamilyMemberController : ControllerBase
    {               
        private readonly ContactsAPIDbContext dbContext;
        public FamilyMemberController(ContactsAPIDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> AllFamilyMembers()
        {
            return Ok(await dbContext.FamilyMembers.ToListAsync());
        }

        [HttpGet("GetByEmail")]
        public async Task<ActionResult<IEnumerable<FamilyMemberDto>>> GetFamilyMembersByEmail( string email)
        {
            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var familyMembers = await dbContext.FamilyMembers
                .Where(fm => fm.UserId == user.Id)
                .Select(fm => new FamilyMemberDto
                {
                    Id = fm.Id,
                    FirstName = fm.FirstName,
                    LastName = fm.LastName,
                    Gender = fm.Gender,
                    BirthDate = fm.BirthDate,
                    Relation = fm.Relation,
                    UserId = user.Id
                })
                .ToListAsync();

            return familyMembers;
        }
        [HttpDelete]
        [Route("DeleteFamilyMember/{id}")]
        public async Task<IActionResult> DeleteMember(Guid id)
        {
            var familyMember = await dbContext.FamilyMembers.FindAsync(id);
            {
                if (familyMember == null)
                {
                    return NotFound();
                }
                dbContext.FamilyMembers.Remove(familyMember);
                dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        [Route("AddFamilyMember/{userId}")]
        public async Task<IActionResult> AddFamilyMember(Guid userId, FamilyMemberDto addFamilyMemberDto)
        {
            try
            {
                var user = await dbContext.Users.FirstOrDefaultAsync(x => x. Id == userId );
                if (user == null)
                {
                    return NotFound("User Not Found!");
                }
                var familyMember = new FamilyMember()
                {
                    Id = Guid.NewGuid(),
                    FirstName = addFamilyMemberDto.FirstName,
                    LastName = addFamilyMemberDto.LastName,
                    Gender = addFamilyMemberDto.Gender,
                    BirthDate = addFamilyMemberDto.BirthDate,//"birthDate":"2000-02-20"
                    Relation = addFamilyMemberDto.Relation,
                    UserId = user.Id
                };
                await dbContext.FamilyMembers.AddAsync(familyMember);
                await dbContext.SaveChangesAsync();

                familyMember.UserId = user.Id;

                return Ok(addFamilyMemberDto);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }

        [HttpPut]
        [Route("UpdateFamilyMember")]
        public async Task<IActionResult> UpdateFamilyMember( FamilyMemberDto updateFamilyMemberDto)
        {
            try
            {
                var familyMember = await dbContext.FamilyMembers.FirstOrDefaultAsync(o => o.Id == updateFamilyMemberDto.Id);
                if (familyMember == null)
                {
                    return NotFound();
                }

                //fm.Id = updateFamilyMember.Id;
                familyMember.FirstName = updateFamilyMemberDto.FirstName;
                familyMember.LastName = updateFamilyMemberDto.LastName;
                familyMember.Gender = updateFamilyMemberDto.Gender;
                familyMember.BirthDate = updateFamilyMemberDto.BirthDate;
                familyMember.Relation = updateFamilyMemberDto.Relation;
                //familyMember.UserId = updateFamilyMemberDto.Id;

                await dbContext.SaveChangesAsync();

                //updateFamilyMemberDto.UserId = user.Id;

                return Ok(familyMember);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }


    }
}
