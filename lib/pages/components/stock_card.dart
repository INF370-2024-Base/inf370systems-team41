import 'package:flutter/material.dart';

class StockCard extends StatelessWidget {
  final Map<String, String> stockItem;

  StockCard({required this.stockItem});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.all(10.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Row(
              children: <Widget>[
                Icon(Icons.inventory),
                SizedBox(width: 10),
                Text('Item: ${stockItem['itemName']}'),
              ],
            ),
            SizedBox(height: 10),
            Row(
              children: <Widget>[
                Icon(Icons.confirmation_number),
                SizedBox(width: 10),
                Text('Stock ID: ${stockItem['stockId']}'),
              ],
            ),
            SizedBox(height: 10),
            Row(
              children: <Widget>[
                Icon(Icons.category),
                SizedBox(width: 10),
                Text('Category: ${stockItem['category']}'),
              ],
            ),
            SizedBox(height: 10),
            Row(
              children: <Widget>[
                Icon(Icons.stacked_bar_chart),
                SizedBox(width: 10),
                Text('Quantity: ${stockItem['quantity']}'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
