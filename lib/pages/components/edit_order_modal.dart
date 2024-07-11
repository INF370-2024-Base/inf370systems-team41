import 'package:flutter/material.dart';

class OrderEditModal extends StatelessWidget {
  final Map<String, String> order;

  OrderEditModal({required this.order});

  @override
  Widget build(BuildContext context) {
    final TextEditingController dentistController = TextEditingController(text: order['dentist']);
    final TextEditingController medicalAidController = TextEditingController(text: order['medicalAid']);
    final TextEditingController patientNameController = TextEditingController(text: order['patientName']);
    final TextEditingController patientSurnameController = TextEditingController(text: order['patientSurname']);
    final TextEditingController medicalAidNumberController = TextEditingController(text: order['medicalAidNumber']);
    final TextEditingController orderStatusController = TextEditingController(text: order['orderStatus']);
    final TextEditingController priorityLevelController = TextEditingController(text: order['priorityLevel']);
    final TextEditingController emergencyNumberController = TextEditingController(text: order['emergencyNumber']);
    final TextEditingController specialRequirementsController = TextEditingController(text: order['specialRequirements']);
    final TextEditingController dueDateController = TextEditingController(text: order['dueDate']);

    return Padding(
      padding: EdgeInsets.all(16.0),
      child: ListView(
        shrinkWrap: true,
        children: <Widget>[
          Text(
            'EDIT ORDER',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 10),
          ListTile(
            leading: Icon(Icons.description),
            title: Text('Order ID: ${order['orderId']}'),
          ),
          TextField(
            controller: dentistController,
            decoration: InputDecoration(
              labelText: 'Dentist',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          TextField(
            controller: medicalAidController,
            decoration: InputDecoration(
              labelText: 'Medical Aid',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          TextField(
            controller: patientNameController,
            decoration: InputDecoration(
              labelText: 'Patient Name',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          TextField(
            controller: patientSurnameController,
            decoration: InputDecoration(
              labelText: 'Patient Surname',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          TextField(
            controller: medicalAidNumberController,
            decoration: InputDecoration(
              labelText: 'Medical Aid Number',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          TextField(
            controller: orderStatusController,
            decoration: InputDecoration(
              labelText: 'Order Status',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          TextField(
            controller: priorityLevelController,
            decoration: InputDecoration(
              labelText: 'Priority Level',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          TextField(
            controller: emergencyNumberController,
            decoration: InputDecoration(
              labelText: 'Emergency Number',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          TextField(
            controller: specialRequirementsController,
            decoration: InputDecoration(
              labelText: 'Special Requirements',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          TextField(
            controller: dueDateController,
            decoration: InputDecoration(
              labelText: 'Due Date',
              border: OutlineInputBorder(),
            ),
          ),
          SizedBox(height: 10),
          ElevatedButton(
            onPressed: () {
              // Handle save action
              Navigator.pop(context);
            },
            child: Text('Save'),
          ),
          SizedBox(height: 10),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              primary: Colors.red,
            ),
            onPressed: () {
              Navigator.pop(context);
            },
            child: Text('Cancel'),
          ),
        ],
      ),
    );
  }
}
