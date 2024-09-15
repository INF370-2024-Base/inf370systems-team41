export class AddStock {
    stockCategoryId: number;
    supplierId: number;
    stockName: string;
    quantityAvailable: number;
    maximumStockLevel: number;
    minimumStockLevel: number;
    reorderPoint?: string;
    measurement: string;

    constructor(
        stockCategoryId: number,
        supplierId: number,
        stockName: string,
        quantityAvailable: number,
        maximumStockLevel: number,
        minimumStockLevel: number,
        measurement: string,
        reorderPoint?: string,
        

    ) {
        this.stockCategoryId = stockCategoryId;
        this.supplierId = supplierId;
        this.stockName = stockName;
        this.quantityAvailable = quantityAvailable;
        this.maximumStockLevel = maximumStockLevel;
        this.minimumStockLevel = minimumStockLevel;
        this.reorderPoint = reorderPoint;
        this.measurement=measurement;
    }
}
export class StockWriteOffViewModel {
    public stockId: number;
    public quantityWrittenOff: number;
    public writtenOffDate: Date;
    public reason: string;
    public stockName: string;

    constructor(
        stockId: number,
        quantityWrittenOff: number,
        writtenOffDate: Date = new Date(),
        reason: string,
        stockName: string,
    ) {
        this.stockId = stockId;
        this.quantityWrittenOff = quantityWrittenOff;
        this.writtenOffDate = writtenOffDate;
        this.reason = reason;
        this.stockName = stockName; 
    }
}

export class CaptureNewStockViewModel {
    public stockId: number;
    public amountAdded: number;

    constructor(stockId: number, amountAdded: number) {
        this.stockId = stockId;
        this.amountAdded = amountAdded;
    }
}

export class AddStockItemViewModel {
    public StockId: number;
    public OrderId: string;
    public Quantity:Number;
    public DateUsed:Date

    constructor(stockId: number, orderId: string,quantity:number,dateUsed:Date) {
        this.StockId = stockId;
        this.OrderId = orderId;
        this.Quantity = quantity;
        this.DateUsed=dateUsed;
    }
}
export interface StockItems {
    StockId: number;
     OrderId: string;
     Quantity:number;
    DateUsed:Date;
    stockName?: string;
    
   
  }

  export interface Stock {
    stockId: number;
    
    stockName: string;
    quantityAvailable: number;
    maximumStockLevel: number;
    minimumStockLevel: number;
  }
  
  export interface WeeklyStockUsage {
    week: number;
    totalUsage: number;
    stockDetails: StockItems[];
  }

export class StockCategoryViewModel {
    public StockTypeId: number;
    public Description: string;
    public StockCategoryId!:Number;

    constructor(stockTypeId: number, description: string,stockCategoryId:number) {
        this.StockTypeId = stockTypeId;
        this.Description = description;
        this.StockCategoryId = stockCategoryId;
    }
}
export class StockTypeViewModel {
    public StockCategoryId!: number[];
    public Description: string;
    public StockTypeId!:Number;

    constructor(stockTypeId: number, description: string,stockCategoryId:number[]) {
        this.StockTypeId = stockTypeId;
        this.Description = description;
        this.StockCategoryId = stockCategoryId;
    }
}
