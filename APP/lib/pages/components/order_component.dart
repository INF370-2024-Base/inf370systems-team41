import 'package:flutter/material.dart';

class OrderComponent extends StatelessWidget {
  final Map<String, dynamic> order;
  final VoidCallback onTap;

  OrderComponent({required this.order, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Text('Order ID: ${order['orderId']}'),
        subtitle: Text('Priority: ${order['priorityLevel']}'),
        trailing: const Icon(Icons.more_vert),
        onTap: onTap,
      ),
    );
  }
}
