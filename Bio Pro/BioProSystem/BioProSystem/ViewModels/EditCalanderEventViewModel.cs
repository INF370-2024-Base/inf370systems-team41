using BioProSystem.Models;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.ViewModels
{
    public class EditCalanderEventViewModel
    {
        public int Id { get; set; } 

        public DateTime CalanderScheduleEventDateTime { get; set; }

        public string Description { get; set; } = null!;

    }
}
