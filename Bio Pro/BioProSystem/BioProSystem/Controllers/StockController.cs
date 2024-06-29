using BioProSystem.EmailService;
using BioProSystem.Models;
using BioProSystem.ViewModels;
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
                    return BadRequest(ex.InnerException.Message);
                }
            }
            else
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
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
        [HttpPost]
        [Route("WriteOffStock")]
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
    }
  
}
