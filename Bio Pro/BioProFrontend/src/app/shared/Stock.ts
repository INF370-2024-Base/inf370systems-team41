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

    constructor(
        stockId: number,
        quantityWrittenOff: number,
        writtenOffDate: Date = new Date(),
        reason: string
    ) {
        this.stockId = stockId;
        this.quantityWrittenOff = quantityWrittenOff;
        this.writtenOffDate = writtenOffDate;
        this.reason = reason;
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

    constructor(stockId: number, orderId: string,quantity:number) {
        this.StockId = stockId;
        this.OrderId = orderId;
        this.Quantity = quantity;
    }
}