using BioProSystem.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.ViewModels
{
    public class SystemOrderViewModel
    {
        //[Required]
        public List<TeethShade> Teethshades {get;set;}=new List<TeethShade>();

        public List<SelectedArea> SelectedAreas { get; set; } = new List<SelectedArea>();
        public SystemOrder systemOrder { get; set; }    
        public OrderType OrderType { get; set; }
        public Dentist Dentist { get; set;}
        public OrderStatus OrderStatus { get; set; }
        public OrderWorkflowTimeline Timeline { get; set; }
        public Patient patient { get; set; }
        public OrderDirection orderDirection { get; set; }
    }
}
