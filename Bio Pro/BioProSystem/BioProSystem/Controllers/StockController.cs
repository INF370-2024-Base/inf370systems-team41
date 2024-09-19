using BioProSystem.EmailService;
using BioProSystem.Models;
using BioProSystem.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Mail;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace BioProSystem.Controllers
{
    [ApiController]
    [Route("stock")]
    public class StockController : Controller
    {

        private readonly IRepository _repository;
        private readonly IEmailSender _emailSender;
        private readonly EmailSettings _emailSettings;
        private readonly UserManager<SystemUser> _userManager;
        public StockController(IRepository repository, IOptions<EmailSettings> emailSettings, IEmailSender emailSender, UserManager<SystemUser> userManager)
        {
            _repository = repository;
            _emailSender = emailSender;
            _emailSettings = emailSettings.Value;
            _userManager = userManager;
        }
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [Route("AddStock")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = " Admin, Owner, Lab Manager")]
        public async Task<IActionResult> AddStock(AddStockViewModel viewModel)
        {
            if (viewModel == null) { return BadRequest(ModelState); }
            if (ModelState.IsValid)
            {
                try
                {


                    Stock newStock = new Stock();
                    newStock.MaximumStockLevel = viewModel.MaximumStockLevel;
                    newStock.MinimumStockLevel = viewModel.MinimumStockLevel;
                    newStock.StockName = viewModel.StockName;
                    newStock.StockCategoryId = viewModel.StockCategoryId;
                    newStock.QuantityAvailable = viewModel.QuantityAvailable;
                    newStock.ReorderPoint = viewModel.ReorderPoint;
                    newStock.SupplierId = viewModel.SupplierId;
                    newStock.CurrentlyInUse = true;
                    newStock.Measurement = viewModel.Measurement;
                    _repository.Add(newStock);
                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(newStock);
                    }
                    else
                    {
                        return BadRequest("Could not save to database");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest("Internal server error.Please contact admin." + ex.InnerException.Message);
                }
            }
            else
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPost]
        [Route("AddStockItem")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = " Design Techician, Employee, Lab Manager")]
        public async Task<IActionResult> AddStockItem(AddStockItemViewModel viewModel)
        {
            if (viewModel == null)
            {
                return BadRequest(ModelState);
            }

            if (ModelState.IsValid)
            {
                try
                {
                    // Retrieve existing entities
                    SystemOrder order = await _repository.GetSystemOrderByIdAsync(viewModel.OrderId);
                    Stock stock = await _repository.GetStockById(viewModel.StockId);

                    if (order == null || stock == null)
                    {
                        return NotFound("Order or Stock not found.");
                    }

                    var newStock = new StockItem
                    {
                        OrderId = viewModel.OrderId,
                        StockId = viewModel.StockId,
                        Quantity = viewModel.Quantity,
                        DateUsed = viewModel.DateUsed,
                        
                    };

                    order.StockItems.Add(newStock);
                    stock.StockItem.Add(newStock);

                    _repository.Add(newStock);

                    // Save changes
                    if (await _repository.SaveChangesAsync())
                    {
                        order.StockItems.Add(newStock);
                        stock.StockItem.Add(newStock);
                        return Ok(newStock);
                    }
                    else
                    {
                        return BadRequest("Could not save to database");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest("Internal server error.Please contact admin." + ex.InnerException.Message);  // Use ex.Message to get the exception message
                }
            }
            else
            {
                return BadRequest(ModelState);  // Return the ModelState errors if the model is invalid
            }
        }
        [HttpGet]
        [Route("GetAllStock")]
        public async Task<IActionResult> GetAllStock()
        {
            try
            {
                List<Stock> allstock = new List<Stock>();
                allstock = await _repository.GetAllStocks();
                if (allstock.Count > 0)
                {
                    return Ok(allstock);
                }
                else
                {
                    return NotFound("No stock found");
                }
            }
            catch (Exception ex)
            {

                return StatusCode(500, "Internal Server Error. Please contact support." + ex.Message);
            }

        }
        [HttpGet]
        [Route("GetAllStockCategories")]
        public async Task<IActionResult> GetAllStockCategories()
        {
            try
            {
                List<StockCategory> allstock = new List<StockCategory>();
                allstock = await _repository.GetAllStockCategories();
                if (allstock.Count > 0)
                {
                    return Ok(allstock);
                }
                else
                {
                    return NotFound("No stock found");
                }
            }
            catch (Exception ex)
            {

                return StatusCode(500, "Internal Server Error. Please contact support." + ex.Message);
            }

        }
        [HttpGet]
        [Route("GetAllSupplier")]
        public async Task<IActionResult> GetAllSupplier()
        {
            try
            {
                List<Supplier> allstock = new List<Supplier>();
                allstock = await _repository.GetAllSupplier();
                if (allstock.Count > 0)
                {
                    return Ok(allstock);
                }
                else
                {
                    return NotFound("No stock found");
                }
            }
            catch (Exception ex)
            {

                return StatusCode(500, "Internal Server Error. Please contact support." + ex.Message);
            }

        }

        [HttpGet]
        [Route("GetAllStockTypes")]
        public async Task<IActionResult> GetAllStockTypes()
        {
            try
            {
                List<StockType> allstock = new List<StockType>();
                allstock = await _repository.GetAllStockTypes();
                if (allstock.Count > 0)
                {
                    return Ok(allstock);
                }
                else
                {
                    return NotFound("No stock found");
                }
            }
            catch (Exception ex)
            {

                return StatusCode(500, "Internal Server Error. Please contact support." + ex.Message);
            }

        }
        [HttpGet]
        [Route("GetStockById/{stockId}")]
        public async Task<IActionResult> GetStockById(int stockId)
        {
            try
            {
 
                 var allstock = await _repository.GetStockById(stockId);
                if (allstock!=null)
                {
                    return Ok(allstock);
                }
                else
                {
                    return NotFound("No stock found");
                }
            }
            catch (Exception ex)
            {

                return StatusCode(500, "Internal Server Error. Please contact support." + ex.Message);
            }

        }
        [Authorize(Roles="Admin")]
        [HttpPost]
        [Route("WriteOffStock")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = " Admin, Owner, Lab Manager")]
        public async Task<IActionResult> WriteOffStock(StockWriteOffViewModel viewModel)
        {
            if (viewModel == null) { return BadRequest(ModelState); }
            if (ModelState.IsValid)
            {
                try
                {


                    StockWriteOff newStockWriteOff = new StockWriteOff();
                    newStockWriteOff.QuantityWrittenOff = viewModel.QuantityWrittenOff;
                    newStockWriteOff.StockId = viewModel.StockId;
                    newStockWriteOff.Reason=viewModel.Reason;

                    Stock stockToEdit=await _repository.GetStockById(viewModel.StockId);
                    if(stockToEdit.QuantityAvailable == 0) 
                    {
                        return BadRequest("No stock to write off");
                    }
                    if(stockToEdit.QuantityAvailable> viewModel.QuantityWrittenOff)
                    {
                        stockToEdit.QuantityAvailable -= viewModel.QuantityWrittenOff;
                    }
                    else
                    {
                        newStockWriteOff.QuantityWrittenOff= stockToEdit.QuantityAvailable;
                        stockToEdit.QuantityAvailable = 0;
                    }
                    if (stockToEdit.QuantityAvailable <= stockToEdit.MinimumStockLevel)
                    {
                        List<SystemUser> labManagers = _userManager.GetUsersInRoleAsync("Lab Manager").Result.ToList();

                        foreach (SystemUser labManager in labManagers)
                        {
                            if (labManager != null)
                            {
                                string phoneNumber = labManager.PhoneNumber.Replace("-", "");
                                if (phoneNumber.StartsWith("0"))
                                {
                                    phoneNumber = "+27" + phoneNumber.Substring(1);
                                }
                                SendSms(phoneNumber, "Stock is low: " + stockToEdit.StockName);
                            }
                        }
                    }


                    _repository.Add(newStockWriteOff);

                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(newStockWriteOff);
                    }
                    else
                    {
                        return BadRequest("Could not save to database");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.InnerException.Message);
                }
            }
            else
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPut]
        [Route("CaptureNewStock")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = " Admin, Owner, Lab Manager")]
        public async Task<IActionResult> CaptureNewStock(CaptureNewStockViewModel viewModel)
        {
            if (viewModel == null) { return BadRequest(ModelState); }
            if (ModelState.IsValid)
            {
                try
                {


                    Stock stockToEdit = await _repository.GetStockById(viewModel.StockId);
                    if(stockToEdit == null) { return NotFound("Stock not found"); }
                    stockToEdit.QuantityAvailable += viewModel.AmountAdded;

                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(stockToEdit);
                    }
                    else
                    {
                        return BadRequest("Could not save to database");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.InnerException.Message);
                }
            }
            else
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
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
        [Route("CreateStockCategory")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = " Admin, Owner, Lab Manager")]
        public async Task<IActionResult> CreateStockCategory(StockCategoryViewModel viewModel)
        {
            if (viewModel == null) { return BadRequest(ModelState); }
            if (ModelState.IsValid)
            {
                try
                {
                    StockCategory newStockCategory=new StockCategory();
                    newStockCategory.Description=viewModel.Description;
                    newStockCategory.StockTypeId=viewModel.StockTypeId.Value;
  
                    StockType stockType = await _repository.GetStockTypeById(viewModel.StockTypeId.Value);
                    _repository.Add(newStockCategory);
                    if(stockType == null)
                    {
                        return BadRequest("Stocktype not found.");
                    }

                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(newStockCategory);
                    }
                    else
                    {
                        return BadRequest("Could not save to database");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.InnerException.Message);
                }
            }
            else
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("CreateStockType")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = " Admin, Owner, Lab Manager")]
        public async Task<IActionResult> CreateStockType(StockTypeViewModel viewModel)
        {
            if (viewModel == null) { return BadRequest(ModelState); }
            if (ModelState.IsValid)
            {
                try
                {

                    StockType newStocktype = new StockType();
                    newStocktype.Description = viewModel.Description;
                    
                    if (newStocktype == null)
                    {
                        return BadRequest("Stocktype not found.");
                    }
                    _repository.Add(newStocktype);

                    if (await _repository.SaveChangesAsync())
                    {
                        if (viewModel.StockCategoryId != null)
                        {
                            foreach (int id in viewModel.StockCategoryId)
                            {
                                StockCategory stockCategory = await _repository.GetStockCategoryById(id);
                                stockCategory.StockTypeId = newStocktype.StockTypeId;
                                newStocktype.StockCategories.Add(stockCategory);
                            }
                        }                       
                        return Ok(newStocktype);
                    }
                    else
                    {
                        return BadRequest("Could not save to database");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest("Internal server error.Please contact admin." + ex.InnerException.Message);
                }
            }
            else
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPut]
        [Route("EditStockType")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = " Admin, Owner, Lab Manager")]
        public async Task<IActionResult> EditStockType(StockTypeViewModel viewModel)
        {
            if (viewModel == null) { return BadRequest(ModelState); }
            if (ModelState.IsValid)
            {
                try
                {
                    if (viewModel.StockTypeId != null)
                    {
                        int stockTypeId = viewModel.StockTypeId.Value;
                        StockType newStocktype = await _repository.GetStockTypeById(stockTypeId);
                        newStocktype.Description = viewModel.Description;

                        if (await _repository.SaveChangesAsync())
                        {
                            if (viewModel.StockCategoryId != null)
                            {
                                if(viewModel.StockCategoryId.Length >= 1)
                               { 
                                    foreach (int id in viewModel.StockCategoryId)
                                    {
                                        StockCategory stockCategory = await _repository.GetStockCategoryById(id);
                                        if(stockCategory != null)
                                        {
                                            stockCategory.StockTypeId = newStocktype.StockTypeId;
                                            newStocktype.StockCategories.Add(stockCategory);
                                        }                                      
                                    }
                                }
                                if(await _repository.SaveChangesAsync() ) 
                                {
                                    return Ok(newStocktype);
                                }
                                else { return BadRequest(ModelState); }
                            }
                            return Ok(newStocktype);
                        }
                        else
                        {
                            return BadRequest(_repository.SaveChangesAsync().Result);
                        }
                    }
                    else
                    {
                        return BadRequest("No stock type sent");
                    }

                }
                catch (Exception ex)
                {
                    return BadRequest("Internal server error.Please contact admin." + ex.InnerException.Message);
                }
            }
            else
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpPut]
        [Route("EditStockCategory")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = " Admin, Owner, Lab Manager")]
        public async Task<IActionResult> EditStockCategory(StockCategoryViewModel viewModel)
        {
            if (viewModel == null) { return BadRequest(ModelState); }
            if (ModelState.IsValid)
            {
                try
                {

                        if(viewModel.StockCategoryId!=null)
                        {
                            int StockCategoryId = viewModel.StockCategoryId.Value;
                            StockCategory stockCategory = await _repository.GetStockCategoryById(StockCategoryId);
                            stockCategory.Description = viewModel.Description;
                            StockType newStocktype = await _repository.GetStockTypeById(viewModel.StockTypeId.Value);
                            newStocktype.StockCategories.Add(stockCategory);

                            if (await _repository.SaveChangesAsync())
                            {
                                return Ok(newStocktype);
                            }
                            else
                            {
                                return BadRequest("Could not save to database");
                            }
                        }
                        else
                        {
                            return BadRequest("No category id sent");
                        }                 

                }
                catch (Exception ex)
                {
                    return BadRequest("Internal server error.Please contact admin." + ex.InnerException.Message);
                }
            }
            else
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }
        [HttpDelete]
        [Route("DeleteStockCategory/{stockCategoryId}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = " Admin, Owner, Lab Manager")]
        public async Task<IActionResult> DeleteStockCategory(int stockCategoryId)
        {
            if (stockCategoryId == null) { return BadRequest("No Id sent."); }
                try
                {
                StockCategory category=await _repository.GetStockCategoryById(stockCategoryId);
                if (category != null)
                    {
                    
                        _repository.Delete(category);
                        if (await _repository.SaveChangesAsync())
                        {
                            return Ok(category);
                        }
                        else
                        {
                            return BadRequest("Cannot delete category that is already connected to stock type or stock!");
                        }
                    }
                    else
                    {
                        return NotFound("No category found");
                    }

                }
                catch (Exception ex)
                {
                    return BadRequest("Internal server error.Please contact admin." + ex.InnerException.Message);
                }
        }
        [HttpDelete]
        [Route("DeleteStockType/{stockTypeId}")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = " Admin, Owner, Lab Manager")]
        public async Task<IActionResult> DeleteStockType(int stockTypeId)
        {
            if (stockTypeId == null) { return BadRequest("No Id sent."); }
            try
            {
                StockType type = await _repository.GetStockTypeById(stockTypeId);
                if (type != null)
                {

                    _repository.Delete(type);
                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(type);
                    }
                    else
                    {
                        return BadRequest("Cannot delete type that is already connected to stock category or stock!");
                    }
                }
                else
                {
                    return NotFound("No type found");
                }

            }
            catch (Exception ex)
            {
                return BadRequest("Internal server error.Please contact admin."+ex.InnerException.Message);
            }
        }

    }
  
}
