﻿using Microsoft.AspNetCore.Mvc;
using BioProSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BioProSystem.ViewModels;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Identity.UI.Services;
using BioProSystem.EmailService;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Org.BouncyCastle.Crypto.Macs;

namespace BioProSystem.Controllers
{
    [ApiController]
    [Route("calendar")]
    public class CalendarController : Controller
    {
        private readonly UserManager<SystemUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IRepository _repository;
        private readonly IUserClaimsPrincipalFactory<SystemUser> _claimsPrincipalFactory;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        private readonly EmailSettings _emailSettings;

        public CalendarController(IOptions<EmailSettings> emailSettings, IEmailSender emailSender, UserManager<SystemUser> userManager, RoleManager<IdentityRole> roleManager, IUserClaimsPrincipalFactory<SystemUser> claimsPrincipalFactory, IConfiguration configuration, IRepository repository)
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
        [Route("CreateCalenderScheduleEvent")]
        //[Authorize(AuthenticationSchemes = "Bearer")]
        //[Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> CreateCalenderScheduleEvent(AddCalanderEventViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                
                CalanderScheduleEvent newCalanderScheduleEvent = new CalanderScheduleEvent();
                newCalanderScheduleEvent.CalanderId = 1;
                newCalanderScheduleEvent.Description =viewModel.Description;
                newCalanderScheduleEvent.CalanderScheduleEventDateTime = viewModel.CalanderScheduleEventDateTime;

                _repository.Add(newCalanderScheduleEvent);
                try
                {
                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(newCalanderScheduleEvent);
                    }
                    else
                    {
                        ModelState.AddModelError(string.Empty, "Failed to save changes.");
                        return BadRequest(ModelState);
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, $"An error occurred: {ex.Message}");
                    return BadRequest(ModelState);
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpGet]
        [Route("GetAllScheduledEvents")]
        public async Task<IActionResult> GetDeliveries()
        {
            try
            {
                List<CalanderScheduleEvent> events = await _repository.GetAllScheduledEvents();
                if (events.Count == 0)
                {
                    return BadRequest("No deliveries found");
                }
                else
                {
                    return Ok(events);
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}

