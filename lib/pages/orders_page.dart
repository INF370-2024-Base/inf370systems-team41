import 'package:biopromobileflutter/pages/components/edit_order_modal.dart';
import 'package:flutter/material.dart';

class OrdersPage extends StatelessWidget {
  final List<Map<String, String>> orders = [
    {
      'orderId': '34561',
      'dentist': 'Charlie Brown',
      'medicalAid': 'Blue Cross Blue Shield',
      'patientName': 'Johanna',
      'patientSurname': 'Ge Lag',
      'medicalAidNumber': '0938462743',
      'orderStatus': 'Pending',
      'priorityLevel': 'Medium',
      'emergencyNumber': '0988976541',
      'specialRequirements': 'vcbgdfhdfbh',
      'dueDate': '22/05/2024',
    },
    {
      'orderId': '6456547',
      'dentist': 'Charlie Brown',
      'medicalAid': 'Blue Cross Blue Shield',
      'patientName': 'Johnny',
      'patientSurname': 'Blue',
      'medicalAidNumber': '0938462743',
      'orderStatus': 'Pending',
      'priorityLevel': 'Medium',
      'emergencyNumber': '0988976541',
      'specialRequirements': 'vcbgdfhdfbh',
      'dueDate': '22/05/2024',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Orders'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(10.0),
        itemCount: orders.length,
        itemBuilder: (context, index) {
          final order = orders[index];
          return Card(
            child: ListTile(
              leading: Icon(Icons.description),
              title: Text('Order ID: ${order['orderId']} - Patient: ${order['patientName']} ${order['patientSurname']}'),
              trailing: Icon(Icons.expand_more),
              onTap: () {
                showModalBottomSheet(
                  context: context,
                  isScrollControlled: true,
                  builder: (BuildContext context) {
                    return OrderEditModal(order: order);
                  },
                );
              },
            ),
          );
        },
      ),
    );
  }
}
