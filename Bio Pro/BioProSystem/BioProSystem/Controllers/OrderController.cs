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

namespace BioProSystem.Controllers
{
    [ApiController]
    [Route("Api/")]
    public class OrderController : Controller
    {
        private readonly UserManager<SystemUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IRepository _repository;
        private readonly IUserClaimsPrincipalFactory<SystemUser> _claimsPrincipalFactory;
        private readonly IConfiguration _configuration;


        public OrderController(UserManager<SystemUser> userManager, RoleManager<IdentityRole> roleManager, IUserClaimsPrincipalFactory<SystemUser> claimsPrincipalFactory, IConfiguration configuration, IRepository repository)
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


        // POST: /Order/Add
        [HttpPost]
        [Route("AddOrders")]
        //[Authorize(AuthenticationSchemes = "Bearer")]
        //[Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> Add(SystemOrderAddViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {


                    var newOrder = new SystemOrder
                    {
                        OrderId = viewModel.OrderId,//dropdown
                        DentistId = viewModel.DentistId,//dropdown or small search pop-up
                        OrderDate = viewModel.OrderDate,//calendar select
                        EmergencyNumber = viewModel.EmergencyNumber,
                        SpecialRequirements = viewModel.SpecialRequirements,
                        PriorityLevel = viewModel.PriorityLevel,
                        DueDate = viewModel.DueDate,
                        OrderTypeId = viewModel.OrderTypeId,
                        OrderStatusId = viewModel.OrderStatusId,
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
                    var orderdirection = await _repository.GetOrderDirectionById(viewModel.OrderDirectionId);
                    var teethShades = await _repository.GetTeethShadesAsync(viewModel.TeethShadesIds);
                    var selectedAreas = await _repository.GetSelectedAreasAsync(viewModel.SeletedAreasIds);
                    orderdirection.OrderDetails.Add(newOrderWorkflowTimelines);

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
                        newPatient.FirsName = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.FirsName;
                        newPatient.Lastname = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.Lastname;
                        newPatient.DentistId = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.DentistId;
                        newPatient.MedicalAidId = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.MedicalAidId;
                        newPatient.MedicalAidNumber = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.MedicalAidNumber;

                        
                    }
                    else
                    {
                        newPatient.FirsName = viewModel.PatientName;
                        newPatient.Lastname = viewModel.PatientSurname;
                        newPatient.DentistId = viewModel.DentistId;
                        newPatient.MedicalAidId = viewModel.MedicalAidId;
                        newPatient.MedicalAidNumber = viewModel.MedicalAidNumber;
                        _repository.Add(newPatient);
                       
                    }   
                    Dentist dentist=_repository.GetDentistdByIdAsync(viewModel.DentistId).Result;
                    dentist.SystemOrders.Add(newOrder);
                    _repository.Add(newOrder);
                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(newOrder);
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
                                newPatient.FirsName = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.FirsName;
                                newPatient.Lastname = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.Lastname;
                                newPatient.DentistId = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.DentistId;
                                newPatient.MedicalAidId = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.MedicalAidId;
                                newPatient.MedicalAidNumber = _repository.GetPatientByMedicalAidNumber(viewModel.MedicalAidNumber).Result.MedicalAidNumber;


                            }
                            else
                            {
                                newPatient.FirsName = viewModel.PatientName;
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
                    employees=_repository.AssignAvailableTechnicians(timeline.OrderDirectionId,pendingOrders.OrderId);
                    foreach(Employee employee in employees)
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
                    pendingOrders.OrderStatusId = 4;
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
