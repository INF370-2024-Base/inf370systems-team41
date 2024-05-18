using BioProSystem.Models;
using BioProSystem.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BioProSystem.Controllers
{
    [ApiController]
    public class LoginController : Controller
    {
        private readonly UserManager<SystemUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IRepository _repository;
        private readonly IUserClaimsPrincipalFactory<SystemUser> _claimsPrincipalFactory;
        private readonly IConfiguration _configuration;

        public LoginController(UserManager<SystemUser> userManager, RoleManager<IdentityRole> roleManager, IUserClaimsPrincipalFactory<SystemUser> claimsPrincipalFactory, IConfiguration configuration, IRepository repository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _claimsPrincipalFactory = claimsPrincipalFactory;
            _configuration = configuration;
            _repository = repository;
        }
        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register(SystemUserAddViewModel uvm)
        {
            var user = await _userManager.FindByIdAsync(uvm.emailaddress);

            if (user == null)
            {
                user = new SystemUser
                {
                    Id = Guid.NewGuid().ToString(),
                    UserName = uvm.emailaddress,
                    Email = uvm.emailaddress,
                    Name = uvm.name,
                    Surname = uvm.surname,

                };
                PasswordManagement management = new PasswordManagement();
                management = new PasswordManagement()
                {
                    ActionTypeId = 1,
                    ChangeTimeStamp = DateTime.Now,
                };
                management.User.Add(user);
                user.Management.Add(management);

                var result = await _userManager.CreateAsync(user, uvm.password);

                if (result.Errors.Count() > 0) return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }
            else
            {
                return Forbid("Account already exists.");
            }
            return Ok();
        }

        [HttpPost]
        [Route("Login")]
        public async Task<ActionResult> Login(SystemUserViewModel uvm)
        {
            Console.WriteLine("Email" + uvm.Emailaddress + " " + uvm.Password);
            var user = await _userManager.FindByNameAsync(uvm.Emailaddress);


            if (user == null)
            {
                // Email not found
                return NotFound("Invalid login credentials");
            }

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, uvm.Password);

            if (isPasswordValid)
            {
                try
                {
                    return await GenerateJWTToken(user);
                }
                catch (Exception)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
                }
            }
            else
            {
                // Password incorrect (avoid revealing email exists for security)
                return BadRequest("Invalid login credentials");
            }
        }

        [HttpGet]
        private async Task<ActionResult> GenerateJWTToken(SystemUser user)
        {
            var role = await _userManager.GetRolesAsync(user);
            IdentityOptions _identityOptions = new IdentityOptions();
            // Create JWT Token
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),

            };

            if (role.Count() > 0)
            {
                claims.Add(new Claim(_identityOptions.ClaimsIdentity.RoleClaimType, role.FirstOrDefault()));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Tokens:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Tokens:Issuer"],
                _configuration["Tokens:Audience"],
                claims,
                signingCredentials: credentials,
                expires: DateTime.UtcNow.AddHours(3)
            );

            return Created("", new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = user.UserName
            });
        }

        [HttpPost]
        [Route("CreateRole")]
        public async Task<IActionResult> CreateRole(string roleName)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role == null)
            {
                role = new IdentityRole
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = roleName
                };

                var result = await _roleManager.CreateAsync(role);

                if (result.Errors.Count() > 0) return BadRequest(result.Errors);
            }
            else
            {
                return Forbid("Role already exists.");
            }

            return Ok();
        }

        [HttpPost]
        [Route("AssignRole")]
        //change
        public async Task<IActionResult> AssignRole(string emailAddress, string roleName)
        {
            var user = await _userManager.FindByEmailAsync(emailAddress);
            if (user == null) return NotFound();

            var result = await _userManager.AddToRoleAsync(user, roleName);
            if (result.Succeeded) return Ok();

            return BadRequest(result.Errors);
        }


        [HttpGet]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = "Admin")]
        [Route("RoleTest")]
        public IActionResult RoleTest()
        {
            return Ok("You are an admin or manager!!!");
        }
        [HttpGet]
        [Route("GetSignInProfile/{emailAddress}")]
        public async Task<IActionResult> GetUser(string emailAddress)
        {
            Console.WriteLine("email add:" + emailAddress);
            try
            {
                var result = await _repository.GetsystemUserAsync(emailAddress);

                if (result == null) return NotFound("Course does not exist");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }
    }
}
