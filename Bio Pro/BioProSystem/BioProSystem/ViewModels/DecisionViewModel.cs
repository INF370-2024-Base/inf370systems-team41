using System.ComponentModel.DataAnnotations;

namespace BioProSystem.ViewModels
{
    public class DecisionViewModel
    {
        public string DecisionLogState { get; set; }

        public string Justification { get; set; }

        public string SystemOrderId { get; set; }

        public DateTime DateOfDecision { get; set; }
    }
}
