import 'package:flutter/material.dart';

class DeliveryCard extends StatelessWidget {
  final Map<String, String> delivery;

  const DeliveryCard({required this.delivery});

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
                const Icon(Icons.local_shipping),
                const SizedBox(width: 10),
                Text('Delivery ID: ${delivery['deliveryId']}'),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: <Widget>[
                const Icon(Icons.info),
                const SizedBox(width: 10),
                Text('Delivery Status: ${delivery['status']}'),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: <Widget>[
                const Icon(Icons.person),
                const SizedBox(width: 10),
                Text('Employee: ${delivery['employee']}'),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: <Widget>[
                const Icon(Icons.description),
                const SizedBox(width: 10),
                Text('System Order ID: ${delivery['orderId']}'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
