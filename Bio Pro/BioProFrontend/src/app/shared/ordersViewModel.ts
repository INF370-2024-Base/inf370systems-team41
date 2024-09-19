export class OpenOrder {
  
    openOrderId: number = 0;
    description:String = '';
    timestamp:Date=new Date();
}

export class DecisionViewModel {
  
    SystemOrderId: number = 0;
    DecisionLogState:String = '';
    Justification:String = '';
    DateOfDecision:Date=new Date();
}