import 'package:flutter/material.dart';

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

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text('Order ID: ${widget.order['orderId']}'),
              const SizedBox(height: 8.0),
              TextFormField(
                controller: _dentistController,
                decoration: const InputDecoration(labelText: 'Dentist'),
                readOnly: true,
              ),
              const SizedBox(height: 8.0),
              TextFormField(
                controller: _medicalAidController,
                decoration: const InputDecoration(labelText: 'Medical Aid'),
                readOnly: true,
              ),
              const SizedBox(height: 8.0),
              // TextFormField(
              //   controller: _patientNameController,
              //   decoration: const InputDecoration(labelText: 'Patient Name'),
              //   readOnly: true,
              // ),
              // const SizedBox(height: 8.0),
              // TextFormField(
              //   controller: _patientSurnameController,
              //   decoration: const InputDecoration(labelText: 'Patient Surname'),
              //   readOnly: true,
              // ),
              const SizedBox(height: 8.0),
              TextFormField(
                controller: _medicalAidNumberController,
                decoration: const InputDecoration(labelText: 'Medical Aid Number'),
                readOnly: true,
              ),
              const SizedBox(height: 8.0),
              TextFormField(
                controller: _orderStatusController,
                decoration: const InputDecoration(labelText: 'Order Status'),
                readOnly: true,
              ),
              const SizedBox(height: 8.0),
              TextFormField(
                controller: _priorityLevelController,
                decoration: const InputDecoration(labelText: 'Priority Level'),
                readOnly: true,
              ),
              const SizedBox(height: 8.0),
              TextFormField(
                controller: _emergencyNumberController,
                decoration: const InputDecoration(labelText: 'Emergency Number'),
                readOnly: true,
              ),
              const SizedBox(height: 8.0),
              TextFormField(
                controller: _specialRequirementsController,
                decoration: const InputDecoration(labelText: 'Special Requirements'),
                readOnly: true,
              ),
              const SizedBox(height: 8.0),
              TextFormField(
                controller: _dueDateController,
                decoration: const InputDecoration(labelText: 'Due Date'),
                readOnly: true,
              ),
              const SizedBox(height: 16.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: <Widget>[
                  // ElevatedButton(
                  //   onPressed: _updateOrder,
                  //   child: const Text('Save'),
                  // ),
                  const SizedBox(width: 8.0),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    child: const Text('Close'),
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
