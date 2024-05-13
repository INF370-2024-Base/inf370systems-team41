using BioProSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BioProSystem.Controllers
{
    public class TeethShadeController : Controller
    {
        private readonly IRepository _repository;
        public IActionResult Index()
        {
            return View();
        }


        
        
    }
}

