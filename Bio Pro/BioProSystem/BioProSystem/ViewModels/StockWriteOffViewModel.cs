namespace BioProSystem.ViewModels
{
    public class StockWriteOffViewModel
    {
        public int StockId { get; set; }
        public int QuantityWrittenOff { get; set; }

        public DateTime WrittenOffDate { get; set; }=DateTime.Now;
        public string Reason { get; set; }  
    }
}
