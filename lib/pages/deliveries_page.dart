import 'package:flutter/material.dart';
import 'components/delivery_card.dart';

class DeliveriesPage extends StatelessWidget {
  final List<Map<String, String>> deliveries = [
    {
      'deliveryId': '1',
      'status': 'Pending',
      'employee': 'John Low',
      'orderId': '6456547',
    },
    {
      'deliveryId': '2',
      'status': 'Completed',
      'employee': 'Jane Doe',
      'orderId': '6456548',
    },
    {
      'deliveryId': '3',
      'status': 'In Progress',
      'employee': 'Alice Smith',
      'orderId': '6456549',
    },
    {
      'deliveryId': '4',
      'status': 'Pending',
      'employee': 'Bob Brown',
      'orderId': '6456550',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Deliveries'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(10.0),
        itemCount: deliveries.length,
        itemBuilder: (context, index) {
          final delivery = deliveries[index];
          return DeliveryCard(delivery: delivery);
        },
      ),
    );
  }
}
