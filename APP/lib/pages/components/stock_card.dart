import 'package:flutter/material.dart';
import 'package:biopromobileflutter/pages/components/write_off_component.dart';

class StockCard extends StatelessWidget {
  final Map<String, dynamic> stockItem;
  final List<String> roles;
  final void Function(Map<String, dynamic>) onWriteOff;

  StockCard({
    required this.stockItem,
    required this.roles,
    required this.onWriteOff,
  });

  @override
  Widget build(BuildContext context) {
    // Check if the user has one of the required roles
    final hasWriteOffPermission = roles.any((role) => ['Admin', 'Owner', 'Lab Manager'].contains(role));

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
            const SizedBox(height: 10),
            if (hasWriteOffPermission) // Show the button based on role
              ElevatedButton(
                onPressed: () async {
                  final writeOffData = await showDialog(
                    context: context,
                    builder: (context) => WriteOffDialog(
                      stockId: stockItem['stockId'],
                      stockName: stockItem['stockName'],
                    ),
                  );
                  if (writeOffData != null) {
                    onWriteOff(writeOffData);
                  }
                },
                child: const Text('Write Off Stock'),
              ),
          ],
        ),
      ),
    );
  }
}
