import 'package:flutter/material.dart';

class StockCard extends StatelessWidget {
  final Map<String, dynamic> stockItem;

  StockCard({required this.stockItem});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(10.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Row(
              children: <Widget>[
                const Icon(Icons.inventory),
                const SizedBox(width: 10),
                Text('Item: ${stockItem['stockName']}'),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: <Widget>[
                const Icon(Icons.confirmation_number),
                const SizedBox(width: 10),
                Text('Stock ID: ${stockItem['stockId']}'),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: <Widget>[
                const Icon(Icons.category),
                const SizedBox(width: 10),
                Text('Category: ${stockItem['stockCategory']['description']}'),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: <Widget>[
                const Icon(Icons.stacked_bar_chart),
                const SizedBox(width: 10),
                Text('Quantity: ${stockItem['quantityAvailable']}'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
