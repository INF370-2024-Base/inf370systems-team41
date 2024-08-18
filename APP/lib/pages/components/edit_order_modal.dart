import 'package:flutter/material.dart';

class EditOrderModal extends StatelessWidget {
  final Map<String, dynamic> order;

  EditOrderModal({required this.order});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text('Order ID: ${order['orderId']}', style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8.0),
            Text('Dentist: ${order['dentist']}'),
            const SizedBox(height: 8.0),
            Text('Medical Aid Number: ${order['patientMedicalAidNumber']}'),
            const SizedBox(height: 8.0),
            Text('Priority Level: ${order['priorityLevel']}'),
            const SizedBox(height: 8.0),
            Text('Special Requirements: ${order['specialRequirements'] ?? "None"}'),
            const SizedBox(height: 8.0),
            Text('Due Date: ${order['dueDate']}'),
            const SizedBox(height: 16.0),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: const Text('Close'),
            ),
          ],
        ),
      ),
    );
  }
}
