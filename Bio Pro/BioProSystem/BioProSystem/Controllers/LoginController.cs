using BioProSystem.EmailService;
using BioProSystem.Models;
using BioProSystem.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using Twilio.Types;
using Twilio.Rest.Api.V2010.Account;

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
        private readonly IEmailSender _emailSender;
        private readonly EmailSettings _emailSettings;

        public LoginController(IEmailSender emailSender, IOptions<EmailSettings> emailSettings, UserManager<SystemUser> userManager, RoleManager<IdentityRole> roleManager, IUserClaimsPrincipalFactory<SystemUser> claimsPrincipalFactory, IConfiguration configuration, IRepository repository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _claimsPrincipalFactory = claimsPrincipalFactory;
            _configuration = configuration;
            _repository = repository;
            _emailSender = emailSender;
            _emailSettings = emailSettings.Value;
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
                    PhoneNumber=uvm.phonenumber
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


                var newRole = await _userManager.AddToRoleAsync(user, uvm.rolename);
                if (result.Succeeded) return Ok();

                return BadRequest(result.Errors);
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
                var islockedou = user.LockoutEnd > DateTime.UtcNow;
                if (user.LockoutEnd>DateTime.UtcNow)
                {
                    return BadRequest("User does not have access");
                }
                try
                {
                    return await GenerateJWTToken(user);
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, "Contact support");
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
        [HttpPut]
        [Route("UpdatePassword")]
        public async Task<IActionResult> UpdatePassword(UpdateUser user)
        {
            if(user.UserEmail != null)
            {
                SystemUser userToUpdate = _repository.GetsystemUserAsync(user.UserEmail).Result;
                if (userToUpdate != null)
                {
                    var result=await _userManager.ChangePasswordAsync(userToUpdate, user.OldPassword, user.NewPassword);
                    if (result.Succeeded)
                    {
                        return Ok(result);
                    }
                    else
                    {
                        return BadRequest(result.Errors.Select(o=>o.Description));
                    }
                }
                else
                {
                   return BadRequest("User with email not found");
                }
            }
            else
            {
                return BadRequest("No user Id sent");
            }

        }
        [HttpPut]
        [Route("ResetPassword")]
        public async Task<IActionResult> ResetPassword(ResetPassword user)
        {
            if (user.UserEmail != null)
            {
                SystemUser userToUpdate = await _repository.GetsystemUserAsync(user.UserEmail);
                if(!userToUpdate.EmailConfirmed) return BadRequest("User does did not try to reset email.");
                if (userToUpdate != null)
                {
                    var token = await _userManager.GeneratePasswordResetTokenAsync(userToUpdate);
                    var result = await _userManager.ResetPasswordAsync(userToUpdate, token, user.NewPassword);
                    userToUpdate.EmailConfirmed = false;
                    if (result.Succeeded)
                    {
                        try
                        {
                            await _repository.SaveChangesAsync();
                            return Ok(result);
                        }
                        catch (DbUpdateConcurrencyException ex)
                        {
                            return Conflict("Concurrency conflict: the user has been modified by another process.");
                        }
                    }
                    else
                    {
                        return BadRequest(result.Errors.Select(o => o.Description));
                    }
                }
                else
                {
                    return BadRequest("User with email not found");
                }
            }
            else
            {
                return BadRequest("No user Id sent");
            }
        }
        [HttpPost]
        [Route("SendSMS")]
        public void SendSms(string toPhoneNumber, string message)
        {
            var messageOptions = new CreateMessageOptions(new PhoneNumber(toPhoneNumber))
            {
                Body = message,
                From = new PhoneNumber("+15702843516")               
            };

            var messageResponse = MessageResource.Create(messageOptions);

            Console.WriteLine(messageResponse.Sid);
        }
       
        [HttpPost]
        [Route("SendResetEmail/{emailAddress}")]
        public async Task<IActionResult> SendResetEmail(string emailAddress)
        {
            if (emailAddress != null)
            {
                SystemUser userToUpdate = _repository.GetsystemUserAsync(emailAddress).Result;
                if (userToUpdate != null)
                {
                    userToUpdate.EmailConfirmed= true;
                    await _repository.SaveChangesAsync();
                    EmailViewModel newemail = new EmailViewModel();
                    newemail.Email = emailAddress;
                    newemail.Emailheader = "Reset Password";
                    newemail.EmailContent = "http://localhost:4200/rp/"+emailAddress;
                    SendTestEmail(newemail);
                    return Ok(newemail);
                }
                else
                {
                    return BadRequest("User with email not found");
                }
            }
            else
            {
                return BadRequest("No user Id sent");
            }
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
        
        public async Task<IActionResult> AssignRole(string emailAddress, string roleName)
        {
            var user = await _userManager.FindByEmailAsync(emailAddress);
            if (user == null) return NotFound();

            var result = await _userManager.AddToRoleAsync(user, roleName);
            if (result.Succeeded) return Ok();

            return BadRequest(result.Errors);
        }
        [HttpPut]
        [Route("EditUser")]
        public async Task<IActionResult> EditUser(EditUser user)
        {
            var userToEdit = await _userManager.FindByEmailAsync(user.OldEmail);
            var employeeToEdit = await _repository.GetEmployeeByEmailAsync(user.OldEmail);
            if (userToEdit == null) return NotFound("Email not found in system.");

            try
            {
                if (user.Role != null)
                {
                    var currentRoles = await _userManager.GetRolesAsync(userToEdit);
                    var currentRole = currentRoles.FirstOrDefault();
                    if (currentRole != null && !currentRole.Equals(user.Role, StringComparison.OrdinalIgnoreCase))
                    {
                        await _userManager.RemoveFromRoleAsync(userToEdit, currentRole);
                        var result = await _userManager.AddToRoleAsync(userToEdit, user.Role);
                        if (!result.Succeeded)
                        {
                            return BadRequest(result.Errors);
                        }
                    }
                }

                userToEdit.PhoneNumber = user.Phonenumber;
                userToEdit.Surname = user.Surname;
                userToEdit.Name = user.Name;

                if (user.UpdatedEmail != null && user.UpdatedEmail!=user.OldEmail)
                {
                    var emailResult = await _userManager.SetEmailAsync(userToEdit, user.UpdatedEmail);
                    if (emailResult.Succeeded)
                    {
                        await _userManager.SetUserNameAsync(userToEdit, user.UpdatedEmail);
                        await _userManager.UpdateNormalizedUserNameAsync(userToEdit);
                        await _userManager.UpdateNormalizedEmailAsync(userToEdit);
                    }
                    else
                    {
                        return BadRequest(emailResult.Errors);
                    }
                }

                if (employeeToEdit != null)
                {
                    employeeToEdit.CellphoneNumber = user.Phonenumber;
                    employeeToEdit.FirstName = user.Name;
                    employeeToEdit.LastName = user.Surname;
                    employeeToEdit.Email = user.UpdatedEmail ?? user.OldEmail; // Ensure email is updated correctly
                }

                await _repository.SaveChangesAsync();
                return Ok(userToEdit);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("RemoveAccess/{userEmail}")]

        public async Task<IActionResult> RemoveAccess(string userEmail)
        {
            SystemUser user= await _userManager.FindByEmailAsync(userEmail);
            Employee employee=await _repository.GetEmployeeByEmailAsync(userEmail);
            if (user != null) 
            { 
                user.isActiveUser = false;
                var result= await _userManager.SetLockoutEnabledAsync(user,true);
                if(result.Succeeded)
                {
                    var lockoutresult = await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);
                    if (!lockoutresult.Succeeded)
                    {
                        return BadRequest(lockoutresult.Errors);
                    }

                }
                else
                {
                    return BadRequest(result.Errors);   
                }
                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    return BadRequest(updateResult.Errors);
                }
                if(employee!=null)
                {
                    employee.isActiveEmployee = false;
                }
                return Ok(user);
            }
            else
            {
                return BadRequest("User not found");
            }
        }
        [HttpGet]
        [Route("GetRoles")]
       
        public async Task<IActionResult> GetRoles()
        {
           

            var result = await _roleManager.Roles.ToListAsync();
            if (result.Any()) return Ok(result);

            return BadRequest("No roles found");
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
            try
            {
                var result = await _repository.GetsystemUserAsync(emailAddress);

                if (result == null) return NotFound("User does not exist");

                var roles = await _userManager.GetRolesAsync(result);
                var userWithRoles = new UserInfoWithRolesViewModel
                {
                    Id = result.Id,
                    Email = result.Email,
                    UserName = result.UserName,
                    EmailConfirmed = result.EmailConfirmed,
                    PhoneNumber = result.PhoneNumber,
                    PhoneNumberConfirmed = result.PhoneNumberConfirmed,
                    TwoFactorEnabled = result.TwoFactorEnabled,
                    LockoutEnabled = result.LockoutEnabled,
                    LockoutEnd = result.LockoutEnd,
                    AccessFailedCount = result.AccessFailedCount,
                    ConcurrencyStamp = result.ConcurrencyStamp,
                    SecurityStamp = result.SecurityStamp,
                    PasswordHash = result.PasswordHash,
                    NormalizedEmail = result.NormalizedEmail,
                    NormalizedUserName = result.NormalizedUserName,
                    Name = result.Name,
                    Surname = result.Surname,
                    IsActiveUser = result.isActiveUser,
                    AuditTrails = result.AuditTrails.ToList(),
                    Roles = roles.ToList()
                };

                return Ok(userWithRoles);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }
        [HttpPost]
        [Route("SendEmail")]
        public async Task<IActionResult> SendTestEmail(EmailViewModel email)
        {
            var client = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.SmtpPort)
            {
                Credentials = new NetworkCredential(_emailSettings.Username, _emailSettings.Password),
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network
            };
            await _emailSender.SendEmailAsync(email.Email, email.Emailheader, email.EmailContent);
            return Ok("Email sent successfully");
        }
        [HttpGet]
        [Route("GetAllCurrentUsers")]
        public async Task<IActionResult> GetAllCurrentUsers()
        {
            try
            {
                List<SystemUser> users = await _repository.GetAllSystemUserActiveAsync();
                if (users == null) return NotFound("No users found");
                var usersWithRoles = new List<UserWithRolesViewModel>();

                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    var userWithRolesDto = new UserWithRolesViewModel
                    {
                        name = user.Name,
                        email = user.Email,
                        surname = user.Surname,
                        phoneNumber = user.PhoneNumber,
                        roles = roles.FirstOrDefault()
                    };
                    usersWithRoles.Add(userWithRolesDto);
                }

                return Ok(usersWithRoles);
            }
            catch
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }

        }
        [HttpPost]
        [Route("CreateTransaction")]
        public async Task<IActionResult> CreateTransaction(AddAuditTrailViewModel vmd)
        {
            try
            {
                if(ModelState.IsValid)
                {
                    AuditTrail newAuditTrail= new AuditTrail();
                    newAuditTrail.TransactionType=vmd.TransactionType;
                    newAuditTrail.SystemUserId=vmd.SystemUserId;
                    newAuditTrail.AdditionalData = vmd.AdditionalData;
                    newAuditTrail.DateOfTransaction=vmd.DateOfTransaction;
                    _repository.Add(newAuditTrail);
                    if(await _repository.SaveChangesAsync())
                    {
                        return Ok(newAuditTrail);
                    }
                    else
                    {
                        return BadRequest("Unable to save changes to database. Please contact admin.");
                    }
                }
                else
                {
                    return BadRequest(ModelState);
                }
            }
            catch(Exception ex)
            {
                return BadRequest("Failed to add audit trail.Please contact admin." + ex.Message);
            }
        }
        [HttpGet]
        [Route("GetAllTransaction")]
        public async Task<IActionResult> GetAllTransaction()
        {
            try
            {
                List<AuditTrail> result = await _repository.GetAllTransactions();

                if (result == null) return NotFound("Transactions not found");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

    }
}
