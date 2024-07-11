import 'package:biopromobileflutter/pages/components/dentist_card.dart';
import 'package:flutter/material.dart';

class DentistsPage extends StatelessWidget {
  final List<Map<String, String>> dentists = [
    {
      'name': 'John Smith',
      'contactDetail': '123-456-7890',
      'address': '123 Main St, City, State, ZIP',
    },
    {
      'name': 'Lisa Johnson',
      'contactDetail': '987-654-3210',
      'address': '456 Elm St, Town, State, ZIP',
    },
    {
      'name': 'Michael Williams',
      'contactDetail': '555-123-4567',
      'address': '789 Oak St, Village, State, ZIP',
    },
    {
      'name': 'Emily Johnson',
      'contactDetail': '555-456-7890',
      'address': '101 Oak St, Springfield, IL 62701',
    },
    {
      'name': 'Charlie Brown',
      'contactDetail': 'charlie.brown@example.com, (555) 345 6789',
      'address': '789 Maple St, Springfield, IL 62701',
    },
    {
      'name': 'Jane Doe',
      'contactDetail': 'jane.doe@example.com, (555) 234 5678',
      'address': '456 Elm St, Springfield, IL 62701',
    },
    {
      'name': 'James Williams',
      'contactDetail': 'james.williams@example.com, (555) 567 8901',
      'address': '303 Cedar St, Springfield, IL 62701',
    },
    {
      'name': 'Sarah Miller',
      'contactDetail': 'sarah.miller@example.com, (555) 678 9012',
      'address': '202 Pine St, Springfield, IL 62701',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dentists'),
      ),
      body: GridView.builder(
        padding: const EdgeInsets.all(10.0),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 10.0,
          mainAxisSpacing: 10.0,
          childAspectRatio: 2 / 2.5, // Adjust aspect ratio to fit content
        ),
        itemCount: dentists.length,
        itemBuilder: (context, index) {
          final dentist = dentists[index];
          return DentistCard(
            name: dentist['name']!,
            contactDetail: dentist['contactDetail']!,
            address: dentist['address']!,
          );
        },
      ),
    );
  }
}
