using Microsoft.AspNetCore.Mvc;
using BioProSystem.Models;
using System.IO;
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
using Microsoft.Extensions.Logging;

namespace BioProSystem.Controllers
{
    [ApiController]
    [Route("Api/")]
    public class OrderController : Controller
    {
        private readonly ILogger<OrderController> _logger;
        private readonly UserManager<SystemUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IRepository _repository;
        private readonly IUserClaimsPrincipalFactory<SystemUser> _claimsPrincipalFactory;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        private readonly EmailSettings _emailSettings;

        public OrderController(ILogger<OrderController> logger,IOptions<EmailSettings> emailSettings, IEmailSender emailSender,UserManager<SystemUser> userManager, RoleManager<IdentityRole> roleManager, IUserClaimsPrincipalFactory<SystemUser> claimsPrincipalFactory, IConfiguration configuration, IRepository repository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _claimsPrincipalFactory = claimsPrincipalFactory;
            _configuration = configuration;
            _repository = repository;
            _emailSender = emailSender;
            _emailSettings = emailSettings.Value;
            _logger = logger;
        }
        [HttpPost]
        [Route("DownloadMediaFile")]
        public IActionResult DownloadImage(int imageId)
        {
            MediaFile media = _repository.GetImageDataFromId(imageId).Result;

            if (media == null || media.FileSelf == null) 
            {
                return NotFound(); 
            }

            string fileName = "converted_image.png";
            byte[] imageBytes = media.FileSelf;
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), fileName);
            System.IO.File.WriteAllBytes(filePath, imageBytes);

            return PhysicalFile(filePath, "image/png", fileName);
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        [Route("SendEmail")]
        public async Task<IActionResult> SendTestEmail(EmailViewModel email)
        {
            var client = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.SmtpPort)
            {
                Credentials = new NetworkCredential(_emailSettings.Username, _emailSettings.Password),
                EnableSsl = true
            };
            await _emailSender.SendEmailAsync(email.Email, email.Emailheader, email.EmailContent);
            return Ok("Email sent successfully");
        }

        // POST: /Order/Add
        [HttpPost]
        [Route("AddOrders")]
        //[Authorize(AuthenticationSchemes = "Bearer")]
        //[Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> Add(SystemOrderAddViewModel viewModel)
        {
            if (ModelState.IsValid)
            { var CheckOrder=_repository.GetSystemOrderByIdAsync(viewModel.OrderId).Result;
                if (CheckOrder != null)
                {
                    return BadRequest("Order Id Already exists");
                }
                try
                {


                    var newOrder = new SystemOrder
                    {
                        OrderId = viewModel.OrderId,
                        DentistId = viewModel.DentistId,//dropdown or small search pop-up
                        OrderDate = viewModel.OrderDate,//calendar select
                        EmergencyNumber = viewModel.EmergencyNumber,
                        SpecialRequirements = viewModel.SpecialRequirements,
                        PriorityLevel = viewModel.PriorityLevel,
                        DueDate = viewModel.DueDate,
                        OrderTypeId = viewModel.OrderTypeId,
                        OrderStatusId = 1,
                        MouthArea=viewModel.MouthArea,
                        PatientMedicalAidNumber=viewModel.MedicalAidNumber
                                                
                    };
                    var newOrderWorkflowTimelines = new OrderWorkflowTimeline
                    {
                        SystemOrderId = newOrder.OrderId,
                        systemOrder = newOrder,
                        OrderDirectionId = viewModel.OrderDirectionId,
                        TimelineDetails="Start Date:"+viewModel.OrderDate.ToShortDateString()+"\n"+"Due Date:"+viewModel.DueDate.ToShortDateString(),
                       
                    };
                    
                    _repository.Add(newOrderWorkflowTimelines);
                    await _repository.SaveChangesAsync();
                    
                    var orderdirection = await _repository.GetOrderDirectionById(viewModel.OrderDirectionId);
                    var teethShades = await _repository.GetTeethShadesAsync(viewModel.TeethShadesIds);
                    var selectedAreas = await _repository.GetSelectedAreasAsync(viewModel.SeletedAreasIds);
                    orderdirection.OrderDetails.Add(newOrderWorkflowTimelines);
                    newOrder.OrderWorkflowTimelineId = newOrderWorkflowTimelines.WorkflowStructureId;
                    newOrder.OrderWorkflowTimeline = newOrderWorkflowTimelines;

                    if (teethShades == null || !teethShades.Any())
                    {
                        return NotFound("No teeth shades found");
                    }

                    foreach (var teethShade in teethShades)
                    {
                        newOrder.TeethShades.Add(teethShade);
                        teethShade.SystemOrders.Add(newOrder); // Assuming bidirectional association
                    }

                    if (selectedAreas == null || !selectedAreas.Any())
                    {
                        return NotFound("No teeth shades found");
                    }

                    foreach (var selectedarea in selectedAreas)
                    {
                        newOrder.SelectedAreas.Add(selectedarea);
                        selectedarea.SystemOrders.Add(newOrder); // Assuming bidirectional association
                    }


                    OpenOrder newOpenOrder = new OpenOrder();
                    if (viewModel.OrderTypeId==1)
                    {
                        newOpenOrder.Description = orderdirection.Description;
                        newOpenOrder.systemOrder = newOrder;
                        _repository.Add(newOpenOrder);
                    }
                    var newPatient = new Patient();
                    Console.WriteLine("is true" + await _repository.CheckSystemPatient(viewModel.MedicalAidNumber));
                    if (await _repository.CheckSystemPatient(viewModel.MedicalAidNumber))
                    {
                        newPatient.FirstName = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.FirstName;
                        newPatient.Lastname = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.Lastname;
                        newPatient.DentistId = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.DentistId;
                        newPatient.MedicalAidId = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.MedicalAidId;
                        newPatient.MedicalAidNumber = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.MedicalAidNumber;                      
                    }
                    else
                    {
                        newPatient.FirstName = viewModel.PatientName;
                        newPatient.Lastname = viewModel.PatientSurname;
                        newPatient.DentistId = viewModel.DentistId;
                        newPatient.MedicalAidId = viewModel.MedicalAidId;
                        newPatient.MedicalAid = await _repository.GetMedicalAidByMedicalAidId(viewModel.MedicalAidId);
                        newPatient.MedicalAidNumber = viewModel.MedicalAidNumber;
                        newPatient.Dentist=_repository.GetDentistdByIdAsync(viewModel.DentistId).Result;
                        _repository.Add(newPatient);
                        try
                        {
   

                            if (await _repository.SaveChangesAsync())
                            {
                               
                            }
                            else
                            {
                                // Failed to save changes
                                return BadRequest("Failed to save new patient.");
                            }
                        }
                        catch (Exception ex)
                        {
                            // Log the exception
                            _logger.LogError(ex, "Error adding new patient.");
                            return StatusCode(500, "Internal server error: " + ex.InnerException.Message);
                        }
                    }   
                    Dentist dentist=_repository.GetDentistdByIdAsync(viewModel.DentistId).Result;
                    dentist.SystemOrders.Add(newOrder);
                    dentist.Patients.Add(newPatient);
                    _repository.Add(newOrder);
                    List<SystemUser> labManagers = _userManager.GetUsersInRoleAsync("Lab Manager").Result.ToList();

                    foreach (SystemUser labManager in labManagers)
                    {
                        if(labManager!=null)
                        { 
                            EmailViewModel email = new EmailViewModel();
                            email.Email = labManager.Email;
                            email.Emailheader = "New " + orderdirection.Description + " ID:" + newOrder.OrderId;
                            email.EmailContent = " Good Day.\n Hope all is well.\n A new order is pending approval on the system.\n Please approve or reject at your earliest convenience";
                            SendTestEmail(email);
                        }
                    }
                   
                        return Ok(newOrder);
                  
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, $"An error occurred: {ex.Message}");
                    return StatusCode(500, "Internal server error: " + ex.InnerException.Message);
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }
        [HttpPut]
        [Route("UpdateOrder")]
        //[Authorize(AuthenticationSchemes = "Bearer")]
        //[Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> Update(SystemOrderAddViewModel viewModel)
        {
            if (ModelState.IsValid)
            { 
                try
                {
                    var editedOrder = _repository.GetSystemOrderByIdAsync(viewModel.OrderId).Result;
                    if (editedOrder != null)
                    {

                        editedOrder.PriorityLevel = viewModel.PriorityLevel;
                        editedOrder.EmergencyNumber = viewModel.EmergencyNumber;
                        editedOrder.SpecialRequirements = viewModel.SpecialRequirements;
                        editedOrder.DueDate = viewModel.DueDate;
                        editedOrder.OrderStatusId = viewModel.OrderStatusId;
                        var newPatient = new Patient();
                         editedOrder.DentistId = viewModel.DentistId;
                        
                        if(viewModel.mediaFileViewModels.Length > 0)
                        {
                            foreach(MediaFileViewModel mediaFile in viewModel.mediaFileViewModels)
                            {
                                MediaFile mediaFile1 = new MediaFile();
                                mediaFile1.FileName = mediaFile.FileName;
                                mediaFile1.FileSelf = Convert.FromBase64String(mediaFile.FileSelf);
                                mediaFile1.FileSizeKb = mediaFile.FileSizeKb;
                                editedOrder.MediaFiles.Add(mediaFile1);
                                mediaFile1.SystemOrderId = editedOrder.OrderId;
                            }
                            
                        }
                        if (editedOrder.PatientMedicalAidNumber != viewModel.MedicalAidNumber)
                        {
                            editedOrder.PatientMedicalAidNumber = viewModel.MedicalAidNumber;

                            if (await _repository.CheckSystemPatient(viewModel.MedicalAidNumber))
                            {
                                newPatient.FirstName = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.FirstName;
                                newPatient.Lastname = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.Lastname;
                                newPatient.DentistId = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.DentistId;
                                newPatient.MedicalAidId = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.MedicalAidId;
                                newPatient.MedicalAidNumber = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.MedicalAidNumber;


                            }
                            else
                            {
                                newPatient.FirstName = viewModel.PatientName;
                                newPatient.Lastname = viewModel.PatientSurname;
                                newPatient.DentistId = viewModel.DentistId;
                                newPatient.MedicalAidId = viewModel.MedicalAidId;
                                newPatient.MedicalAidNumber = viewModel.MedicalAidNumber;
                                _repository.Add(newPatient);

                            }
                        }
                    }

                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(editedOrder);
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



        [HttpGet("api/medicalaids")]
        public async Task<IActionResult> GetMedicalAids()
        {
            try
            {
                var medicalAids = await _repository.GetMedicalAidsAsync(); // Await the asynchronous method
                return Ok(medicalAids); // Return list of medical aids as JSON response
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("api/dentists")]
        public async Task<IActionResult> GetDentists()
        {
            try
            {
                var dentists = await _repository.GetDentistsAsync(); // Await the asynchronous method
                return Ok(dentists); // Return list of dentists as JSON response
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpGet("GetOrdersInProgressAndNullTimlines")]
        public async Task<IActionResult> GetOrdersInProgressAndNullTimlines()
        {
            try
            {
                var orders = await _repository.GetOrdersInProgressAndNoTimeline(); // Await the asynchronous method
                return Ok(orders); // Return list of dentists as JSON response
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("GetOrdersById/{OrderId}")]
        public async Task<IActionResult> GetSystemOrdersByIdAsync(string OrderId)
        {
            try
            {
                var result = await _repository.GetSystemOrderByIdAsync(OrderId);

                if (result == null)
                    return NotFound("No order found");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpGet("GetOrderDirectionById/{OrderDirectionId}")]
        public async Task<IActionResult> GetOrderDirectionByIdAsync(int OrderDirectionId)
        {
            try
            {
                var result = await _repository.GetOrderDirectionById(OrderDirectionId);

                if (result == null)
                    return NotFound("No order found");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpGet("GetAllOrders")]
        public async Task<IActionResult> GetAllSystemOrdersAsync()
        {
            try
            {
                var result = await _repository.GetAllSystemOrdersAsync();

                if (result == null)
                    return NotFound("No order found");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpGet("GetFinishedOrders")]
        public async Task<IActionResult> GetFinishedOrders()
        {
            try
            {
                var result = await _repository.GetFinishedSystemWithoutDeliveriesOrders();

                if (result == null)
                    return NotFound("No order found");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpGet("GetAllOrderInfo/{OrderId}")]
        public async Task<IActionResult> GetAllOrderInfo(string OrderId)
        {
            try
            {
                var result = await _repository.GetAllSystemOrdersInformationAsync(OrderId);

                if (result == null)
                    return NotFound("No order found");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("api/ordertypes")]
        public async Task<IActionResult> GetOrderTypes()
        {
            try
            {
                var orderTypes = await _repository.GetOrderTypesAsync(); // Call repository method to fetch order types
                return Ok(orderTypes); // Return list of order types as JSON response
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("api/orderstatuses")]
        public async Task<IActionResult> GetOrderStatuses()
        {
            try
            {
                var orderStatuses = await _repository.GetOrderStatusesAsync(); // Call repository method to fetch order statuses
                return Ok(orderStatuses); // Return list of order statuses as JSON response
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("api/orderdirections")]
        public async Task<IActionResult> GetOrderDirections()
        {
            try
            {
                var orderDirections = await _repository.GetOrderDirectionsAsync(); // Call repository method to fetch order directions
                return Ok(orderDirections); // Return list of order directions as JSON response
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // GET: api/teethshade/colors
        [HttpGet("api/teethshades")]
        public async Task<ActionResult<IEnumerable<TeethShade>>> GetTeethShadeColors()
        {
            try
            {
                var teethShades = await _repository.GetAllTeethShadesAsync(); // Await the asynchronous method

                if (teethShades == null || !teethShades.Any())
                {
                    return NotFound("No teeth shades found");
                }

                return Ok(teethShades); // Return list of teeth shades as JSON response
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}"); // Handle and log any exceptions
            }
        }
        [HttpGet("api/selectedareas")]
        public async Task<ActionResult<IEnumerable<TeethShade>>> GetSelectedAreas()
        {
            try
            {
                var selectedAreas = await _repository.GetSelectedAreasAsync(); // Await the asynchronous method

                if (selectedAreas == null || !selectedAreas.Any())
                {
                    return NotFound("No teeth shades found");
                }

                return Ok(selectedAreas); // Return list of teeth shades as JSON response
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}"); // Handle and log any exceptions
            }
        }

        [HttpGet("GetPendingOrders")]
        public async Task<ActionResult<IEnumerable<SystemOrder>>> GetPendingOrders()
        {
            try
            {
                var pendingOrders = await _repository.GetPendingSystemOrders();
                if(pendingOrders == null || !pendingOrders.Any())
                {
                    return NotFound("No pending orders found");
                }
                else
                {
                    return Ok(pendingOrders);
                }
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }

        }
        [HttpPut]
        [Route("ApprovePendingOrder/{orderId}")]
        public async Task<ActionResult<IEnumerable<SystemOrder>>> ApprovePendingOrders(string orderId)
        {
            try
            {
                var pendingOrders = await _repository.GetSystemOrderByIdAsync(orderId);
                if (pendingOrders == null)
                {
                    return NotFound("No pending orders found");
                }
                if (pendingOrders.OrderStatusId != 1)
                {
                    return NotFound("Order is not a pending orders found");
                }
                else
                {
                    pendingOrders.OrderStatusId = 2;
                    OrderWorkflowTimeline timeline = _repository.GetOrdertimeFlowBySystemOrderId(orderId).Result;
                    List<Employee> employees = new List<Employee>();
                    try
                    {
                        employees = _repository.AssignAvailableTechnicians(timeline.OrderDirectionId, pendingOrders.OrderId);
                    }
                    catch (Exception ex)
                    {
                        // Catch the exception thrown by AssignAvailableTechnicians and rethrow it
                        return BadRequest(ex.Message);
                    }
                    foreach (Employee employee in employees)
                    {
                        employee.SystemOrders.Add(pendingOrders);
                        pendingOrders.Employees.Add(employee);
                    }
                }
                if (await _repository.SaveChangesAsync())
                {
                    return Ok(pendingOrders);
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Failed to save changes.");
                    return BadRequest(ModelState);
                }
            }
            catch(Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
        [HttpPut]
        [Route("DissaprovePendingOrder/{orderId}")]
        public async Task<ActionResult<IEnumerable<SystemOrder>>> DissaprovePendingOrders(string orderId)
        {
            try
            {
                var pendingOrders = await _repository.GetSystemOrderByIdAsync(orderId);
                if (pendingOrders == null )
                {
                    return NotFound("No pending orders found");
                }
                if(pendingOrders.OrderStatusId!=1)
                {
                    return NotFound("Order is already in progres. Please cancel order instead");
                }
                else
                {
                    pendingOrders.OrderStatusId = 7;
                }
                if (await _repository.SaveChangesAsync())
                {
                    return Ok(pendingOrders);
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Failed to save changes.");
                    return BadRequest(ModelState);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        //[HttpGet("Create")]
        //public async Task<IActionResult> Create()
        //{
        //    var viewModel = new SystemOrderViewModel();

        //    try
        //    {
        //        // Populate dropdown lists asynchronously
        //        viewModel.Dentists = new SelectList(await _repository.GetDentistsAsync(), "DentistId", "FullName");
        //        viewModel.MedicalAids = new SelectList(await _repository.GetMedicalAidsAsync(), "MedicalAidId", "Name");
        //        viewModel.OrderDirections = new SelectList(await _repository.GetOrderDirectionsAsync(), "OrderDirectionId", "Name");
        //        viewModel.OrderType = new SelectList(await _repository.GetOrderTypesAsync(), "OrderTypeId", "Name");
        //        viewModel.OrderStatus = new SelectList(await _repository.GetOrderStatusesAsync(), "OrderStatusId", "Name");
        //        var allTeethShades = await _repository.GetAllTeethShadesAsync();

        //        // Create a SelectList for TeethShades with appropriate display and value fields
        //        viewModel.TeethShades = new SelectList(allTeethShades, "TeethShadeId", "Colour", "ColourCode");



        //        return View(viewModel);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Internal Server Error: {ex.Message}");
        //    }
        //}

    }
}
