using BioProSystem.Models;
using BioProSystem.ViewModels;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = " Admin, Owner, Lab Manager")]

        public async Task<IActionResult> CreateTimeline(ProceduralTimelineViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    ProceduralTimeline newTimeline = new ProceduralTimeline();
                    newTimeline.TimelineDetail = viewModel.TimelineDetail;
                    newTimeline.CalanderId = 2;
                    newTimeline.TimeStamp = DateTime.Now;
                    DateTime latestDate = DateTime.MinValue;
                    DateTime earliestDate = DateTime.MaxValue;
                    foreach (string systemorderId in viewModel.OrderIds)
                    {
                        OrderWorkflowTimeline orders = _repository.GetOrdertimeFlowBySystemOrderId(systemorderId).Result;
                        if (orders != null)
                        {
                            orders.TimelineId = newTimeline.ProceduralTimelineId;
                            newTimeline.OrderWorkflowTimeline.Add(orders);
                            if(latestDate<orders.systemOrder.DueDate)
                            {
                                latestDate=orders.systemOrder.DueDate;
                            }
                            if(earliestDate > orders.systemOrder.OrderDate)
                            {
                                earliestDate=orders.systemOrder.OrderDate;
                            }
                        }
                        if(systemorderId == viewModel.OrderIds.Last())
                        {
                            newTimeline.LatestDateTime = latestDate;
                            newTimeline.EarliestDateTime = earliestDate;
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
                    ModelState.AddModelError(string.Empty, $"An error occurred: {ex.InnerException}");
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
