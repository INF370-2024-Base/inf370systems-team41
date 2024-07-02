namespace BioProSystem.ViewModels
{
    public class StockWriteOffViewModel
    {
        public int StockId { get; set; }
        public decimal QuantityWrittenOff { get; set; }
        public string StockName { get; set; }

        public DateTime WrittenOffDate { get; set; }=DateTime.Now;
        public string Reason { get; set; }
        public int StockWriteOffId { get; set; }
       
 
       
    }
}
