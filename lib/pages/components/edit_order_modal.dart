import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class OrderEditModal extends StatefulWidget {
  final Map<String, dynamic> order;

  OrderEditModal({required this.order});

  @override
  _OrderEditModalState createState() => _OrderEditModalState();
}

class _OrderEditModalState extends State<OrderEditModal> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _dentistController;
  late TextEditingController _medicalAidController;
  late TextEditingController _patientNameController;
  late TextEditingController _patientSurnameController;
  late TextEditingController _medicalAidNumberController;
  late TextEditingController _orderStatusController;
  late TextEditingController _priorityLevelController;
  late TextEditingController _emergencyNumberController;
  late TextEditingController _specialRequirementsController;
  late TextEditingController _dueDateController;

  @override
  void initState() {
    super.initState();
    _dentistController = TextEditingController(text: widget.order['dentist']);
    _medicalAidController = TextEditingController(text: widget.order['medicalAid']);
    _patientNameController = TextEditingController(text: widget.order['patientName']);
    _patientSurnameController = TextEditingController(text: widget.order['patientSurname']);
    _medicalAidNumberController = TextEditingController(text: widget.order['medicalAidNumber']);
    _orderStatusController = TextEditingController(text: widget.order['orderStatus']);
    _priorityLevelController = TextEditingController(text: widget.order['priorityLevel']);
    _emergencyNumberController = TextEditingController(text: widget.order['emergencyNumber']);
    _specialRequirementsController = TextEditingController(text: widget.order['specialRequirements']);
    _dueDateController = TextEditingController(text: widget.order['dueDate']);
  }

  @override
  void dispose() {
    _dentistController.dispose();
    _medicalAidController.dispose();
    _patientNameController.dispose();
    _patientSurnameController.dispose();
    _medicalAidNumberController.dispose();
    _orderStatusController.dispose();
    _priorityLevelController.dispose();
    _emergencyNumberController.dispose();
    _specialRequirementsController.dispose();
    _dueDateController.dispose();
    super.dispose();
  }

  Future<void> _updateOrder() async {
    if (_formKey.currentState!.validate()) {
      final updatedOrder = {
        'orderId': widget.order['orderId'],
        'dentist': _dentistController.text,
        'medicalAid': _medicalAidController.text,
        'patientName': _patientNameController.text,
        'patientSurname': _patientSurnameController.text,
        'medicalAidNumber': _medicalAidNumberController.text,
        'orderStatus': _orderStatusController.text,
        'priorityLevel': _priorityLevelController.text,
        'emergencyNumber': _emergencyNumberController.text,
        'specialRequirements': _specialRequirementsController.text,
        'dueDate': _dueDateController.text,
      };

      final response = await http.put(
        Uri.parse('https://localhost:44315/Api/UpdateOrder'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(updatedOrder),
      );

      if (response.statusCode == 200) {
        Navigator.pop(context, 'Order updated successfully');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update order')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text('Order ID: ${widget.order['orderId']}'),
              SizedBox(height: 8.0),
              TextFormField(
                controller: _dentistController,
                decoration: InputDecoration(labelText: 'Dentist'),
              ),
              SizedBox(height: 8.0),
              TextFormField(
                controller: _medicalAidController,
                decoration: InputDecoration(labelText: 'Medical Aid'),
              ),
              SizedBox(height: 8.0),
              TextFormField(
                controller: _patientNameController,
                decoration: InputDecoration(labelText: 'Patient Name'),
              ),
              SizedBox(height: 8.0),
              TextFormField(
                controller: _patientSurnameController,
                decoration: InputDecoration(labelText: 'Patient Surname'),
              ),
              SizedBox(height: 8.0),
              TextFormField(
                controller: _medicalAidNumberController,
                decoration: InputDecoration(labelText: 'Medical Aid Number'),
              ),
              SizedBox(height: 8.0),
              TextFormField(
                controller: _orderStatusController,
                decoration: InputDecoration(labelText: 'Order Status'),
              ),
              SizedBox(height: 8.0),
              TextFormField(
                controller: _priorityLevelController,
                decoration: InputDecoration(labelText: 'Priority Level'),
              ),
              SizedBox(height: 8.0),
              TextFormField(
                controller: _emergencyNumberController,
                decoration: InputDecoration(labelText: 'Emergency Number'),
              ),
              SizedBox(height: 8.0),
              TextFormField(
                controller: _specialRequirementsController,
                decoration: InputDecoration(labelText: 'Special Requirements'),
              ),
              SizedBox(height: 8.0),
              TextFormField(
                controller: _dueDateController,
                decoration: InputDecoration(labelText: 'Due Date'),
              ),
              SizedBox(height: 16.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: <Widget>[
                  ElevatedButton(
                    onPressed: _updateOrder,
                    child: Text('Save'),
                  ),
                  SizedBox(width: 8.0),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    child: Text('Close'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
