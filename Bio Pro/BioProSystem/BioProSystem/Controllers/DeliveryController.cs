using Microsoft.AspNetCore.Mvc;
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
    [Route("delivery")]
    public class DeliveryController : Controller
    {
        private readonly UserManager<SystemUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IRepository _repository;
        private readonly IUserClaimsPrincipalFactory<SystemUser> _claimsPrincipalFactory;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        private readonly EmailSettings _emailSettings;

        public DeliveryController(IOptions<EmailSettings> emailSettings, IEmailSender emailSender, UserManager<SystemUser> userManager, RoleManager<IdentityRole> roleManager, IUserClaimsPrincipalFactory<SystemUser> claimsPrincipalFactory, IConfiguration configuration, IRepository repository)
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
        [Route("createDelivery")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = "Admin, Lab Manager, Owner")]
        public async Task<IActionResult> CreateDelivery(DeliverAddViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                Employee driver = _repository.GetEmployeeByEmailAsync(viewModel.EmployeeEmail).Result;
                if (driver==null)
                {
                    return BadRequest("Not currently signed in as an employee");
                }
                Delivery delivery = new Delivery
                {
                    DeliveryStatusId = 1,
                    EmployeeId = driver.EmployeeId,
                    SystemOrderId = viewModel.SystemOrderId
                };

                
                _repository.Add(delivery);
                try
                { 
                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(delivery);
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
        [Route("GetDeliveries")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = "Admin, Lab Manager, Owner")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetDeliveries()
        {
            try
            {
                List<Delivery> deliveries = await _repository.GetDeliveries(); 
                if(deliveries.Count == 0)
                {
                    return BadRequest("No deliveries found");
                }
                else {
                    return Ok(deliveries);
                }
                
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("GetDeliveryStatuses")]
        public async Task<IActionResult> GetDeliveryStatuses()
        {
            try
            {
                List<DeliveryStatus> deliveryStatuses = await _repository.GetDeliveryStatuses();
                if (deliveryStatuses.Count == 0)
                {
                    return BadRequest("No delivery statuses found");
                }
                else
                {
                    return Ok(deliveryStatuses);
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("UpdateDeliveryCollected/{deliveryId}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = "Admin, Lab Manager, Owner")]

        public async Task<IActionResult> UpdateDeliveryCollected(int deliveryId)
        {
            try
            {
                Delivery delivery= await _repository.GetDeliveryById(deliveryId);
                if (delivery ==null)
                {
                    return BadRequest("Delivery not found found");
                }
                else
                {
                    if (delivery.DeliveryStatusId == 2)
                    {
                        return BadRequest("Delivery already out");
                    }
                    delivery.DeliveryStatusId = 2;
                    if(await _repository.SaveChangesAsync())
                    {
                        return Ok(delivery);
                    }
                    else
                    {
                        return BadRequest("Failed to update delivery.Please contact admin.");
                    }
                   
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("UpdateDeliveryDelivered/{deliveryId}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = "Admin, Lab Manager, Owner")]

        public async Task<IActionResult> UpdateDeliveryDelivered(int deliveryId)
        {
            try
            {
                Delivery delivery = await _repository.GetDeliveryById(deliveryId);
                if (delivery == null)
                {
                    return BadRequest("Delivery not found found");
                }
                else
                {
                    if (delivery.DeliveryStatusId == 3)
                    {
                        return BadRequest("Delivery already delivered");
                    }
                    delivery.DeliveryStatusId = 3;
                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(delivery);
                    }
                    else
                    {
                        return BadRequest("Failed to update delivery.Please contact admin.");
                    }

                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}
