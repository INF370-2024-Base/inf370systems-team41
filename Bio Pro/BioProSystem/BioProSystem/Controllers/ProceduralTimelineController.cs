﻿using BioProSystem.Models;
using BioProSystem.ViewModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BioProSystem.Controllers
{
    [ApiController]
    [Route("timeline")]
    public class ProceduralTimelineController : Controller
    {
        private readonly UserManager<SystemUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IRepository _repository;
        private readonly IUserClaimsPrincipalFactory<SystemUser> _claimsPrincipalFactory;
        private readonly IConfiguration _configuration;

        public ProceduralTimelineController(UserManager<SystemUser> userManager, RoleManager<IdentityRole> roleManager, IUserClaimsPrincipalFactory<SystemUser> claimsPrincipalFactory, IConfiguration configuration, IRepository repository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _claimsPrincipalFactory = claimsPrincipalFactory;
            _configuration = configuration;
            _repository = repository;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("CreateTimeline")]
        public async Task<IActionResult> CreateTimeline(ProceduralTimelineViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    ProceduralTimeline newTimeline = new ProceduralTimeline();
                    newTimeline.TimelineDetail = viewModel.TimelineDetail;
                    newTimeline.CalanderId = 1;
                    newTimeline.TimeStamp = DateTime.Now;
                    foreach (string systemorderId in viewModel.OrderIds)
                    {
                        OrderWorkflowTimeline orders = _repository.GetOrdertimeFlowBySystemOrderId(systemorderId).Result;
                        if (orders != null)
                        {
                            orders.TimelineId = newTimeline.ProceduralTimelineId;
                            newTimeline.OrderWorkflowTimeline.Add(orders);
                        }
                    }
                    _repository.Add(newTimeline);
                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(newTimeline);
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


    }
}