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
using System.Globalization;

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
        [Route("CreateScheduledEvent")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = "Admin, Owner")]
        public async Task<IActionResult> CreateScheduledEvent(EditCalanderEventViewModel viewModel)
        {
            try
            {
                CalanderScheduleEvent calendarEvent = new CalanderScheduleEvent();
                if (viewModel == null)
                {
                    return NotFound("No calendar events found");
                }
                else
                {
                    calendarEvent.CalanderScheduleEventDateTime = viewModel.CalanderScheduleEventDateTime;
                    calendarEvent.Description = viewModel.Description;
                    calendarEvent.Information = viewModel.EventInformation;
                    calendarEvent.CalanderId = 1;
                    _repository.Add(calendarEvent);
                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(calendarEvent);
                    }
                    else
                    {
                        return BadRequest("No changes made");
                    }

                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("GetAllScheduledEvents")]
        
        public async Task<IActionResult> GetAllScheduledEvents()
        {
            try
            {
                List<CalanderScheduleEvent> events = await _repository.GetAllScheduledEvents();
                if (events.Count == 0)
                {
                    return BadRequest("No events found");
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

        [HttpPut]
        [Route("UpdateScheduledEvent")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = "Admin, Owner")]
        
        public async Task<IActionResult> UpdateScheduledEvent(EditCalanderEventViewModel viewModel)
        {
            try
            {
                CalanderScheduleEvent calendarEvent = await _repository.GetScheduledEventById(viewModel.Id);
                if (calendarEvent == null)
                {
                    return NotFound("No calendar events found");
                }
                else
                {
                    calendarEvent.CalanderScheduleEventDateTime=viewModel.CalanderScheduleEventDateTime;
                    calendarEvent.Description=viewModel.Description;
                    calendarEvent.Information = viewModel.EventInformation;
                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(calendarEvent);
                    }
                    else
                    {
                        return BadRequest("No changes made");
                    }
                    
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    
        [HttpDelete]
        [Route("DeleteScheduledEvent/{eventID}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = "Admin, Owner")]
        
        public async Task<IActionResult> DeleteScheduledEvent(int eventID)
        {
            try
            {
                CalanderScheduleEvent calendarEvent = await _repository.GetScheduledEventById(eventID);
                if (calendarEvent == null)
                {
                    return NotFound("Event not found");
                }
                else
                {
                    _repository.Delete(calendarEvent);
                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(calendarEvent);
                    }
                    else
                    {
                        return BadRequest("No changes made");
                    }

                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("GetAllCalendars")]
        public async Task<IActionResult> GetAllCalendars()
        {
            try
            {
                List<Calander> calendars = await _repository.GetAllCalendar();
                if (calendars.Count == 0)
                {
                    return BadRequest("No events found");
                }
                else
                {
                    return Ok(calendars);
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("GetAllProceduralTimelines")]
        public async Task<IActionResult> GetAllProceduralTimelines()
        {
            try
            {
                List<ProceduralTimeline> procduralTimelines = await _repository.GetAllProceduralTimelinesAsync();
                if (procduralTimelines==null)
                {
                    return BadRequest("No procdural timelines found");
                }
                else
                {
                    return Ok(procduralTimelines);
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

    }
}

