using BioProSystem.Models;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.ViewModels
{
    public class AddCalanderEventViewModel
    {

        public DateTime CalanderScheduleEventDateTime { get; set; }

        public string Description { get; set; } = null!;

    }
}
