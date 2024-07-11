import 'package:flutter/material.dart';
import 'components/stock_card.dart';

class StocksPage extends StatelessWidget {
  final List<Map<String, String>> stockItems = [
    {
      'itemName': 'Dental Impression Material',
      'stockId': 'S1001',
      'category': 'Impression Materials',
      'quantity': '50',
    },
    {
      'itemName': 'Dental Cement',
      'stockId': 'S1002',
      'category': 'Cements',
      'quantity': '30',
    },
    {
      'itemName': 'Dental Bur',
      'stockId': 'S1003',
      'category': 'Burs',
      'quantity': '100',
    },
    {
      'itemName': 'Dental Composite',
      'stockId': 'S1004',
      'category': 'Composites',
      'quantity': '20',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Stocks'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(10.0),
        itemCount: stockItems.length,
        itemBuilder: (context, index) {
          final stockItem = stockItems[index];
          return StockCard(stockItem: stockItem);
        },
      ),
    );
  }
}
