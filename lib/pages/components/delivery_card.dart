import 'package:flutter/material.dart';

class DeliveryCard extends StatelessWidget {
  final Map<String, String> delivery;

  DeliveryCard({required this.delivery});

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
                Icon(Icons.local_shipping),
                SizedBox(width: 10),
                Text('Delivery ID: ${delivery['deliveryId']}'),
              ],
            ),
            SizedBox(height: 10),
            Row(
              children: <Widget>[
                Icon(Icons.info),
                SizedBox(width: 10),
                Text('Delivery Status: ${delivery['status']}'),
              ],
            ),
            SizedBox(height: 10),
            Row(
              children: <Widget>[
                Icon(Icons.person),
                SizedBox(width: 10),
                Text('Employee: ${delivery['employee']}'),
              ],
            ),
            SizedBox(height: 10),
            Row(
              children: <Widget>[
                Icon(Icons.description),
                SizedBox(width: 10),
                Text('System Order ID: ${delivery['orderId']}'),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
