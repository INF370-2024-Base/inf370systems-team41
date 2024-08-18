import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class EditOrderModal extends StatefulWidget {
  final Map<String, dynamic> order;

  EditOrderModal({required this.order});

  @override
  _EditOrderModalState createState() => _EditOrderModalState();
}

class _EditOrderModalState extends State<EditOrderModal> {
  final _formKey = GlobalKey<FormState>();

  late TextEditingController _priorityLevelController;
  late TextEditingController _specialRequirementsController;
  late TextEditingController _dueDateController;
  late TextEditingController _emergencyNumberController;
  late TextEditingController _mouthAreaController;
  late TextEditingController _estimatedDurationController;
  late TextEditingController _medicalAidNumberController;
  List<int> selectedAreasIds = [];

  @override
  void initState() {
    super.initState();
    _priorityLevelController = TextEditingController(text: widget.order['priorityLevel']);
    _specialRequirementsController = TextEditingController(text: widget.order['specialRequirements']);
    _dueDateController = TextEditingController(text: widget.order['dueDate']);
    _emergencyNumberController = TextEditingController(text: widget.order['emergencyNumber']);
    _mouthAreaController = TextEditingController(text: widget.order['mouthArea']);
    _estimatedDurationController = TextEditingController(text: widget.order['estimatedDurationInDays']?.toString() ?? '');
    _medicalAidNumberController = TextEditingController(text: widget.order['patientMedicalAidNumber']);
    selectedAreasIds = widget.order['selectedAreasIds']?.cast<int>() ?? [];
  }

  @override
  void dispose() {
    _priorityLevelController.dispose();
    _specialRequirementsController.dispose();
    _dueDateController.dispose();
    _emergencyNumberController.dispose();
    _mouthAreaController.dispose();
    _estimatedDurationController.dispose();
    _medicalAidNumberController.dispose();
    super.dispose();
  }

  Future<void> _saveChanges() async {
    if (_formKey.currentState!.validate()) {
      final updatedOrder = {
        "orderId": widget.order['orderId'],
        "orderDate": widget.order['orderDate'],
        "priorityLevel": _priorityLevelController.text,
        "specialRequirements": _specialRequirementsController.text,
        "dueDate": _dueDateController.text,
        "emergencyNumber": _emergencyNumberController.text,
        "mouthArea": _mouthAreaController.text,
        "estimatedDurationInDays": int.tryParse(_estimatedDurationController.text) ?? 0,
        "medicalAidNumber": _medicalAidNumberController.text,
        "dentistId": widget.order['dentistId'],
        "orderTypeId": widget.order['orderTypeId'],
        "orderStatusId": widget.order['orderStatusId'],
        "orderWorkflowTimelineId": widget.order['orderWorkflowTimelineId'],
        "teethShadesIds": widget.order['teethShadesIds'] ?? [],
        "selectedAreasIds": selectedAreasIds.isNotEmpty ? selectedAreasIds : [0], // Ensure it's populated
        "mediaFileViewModels": widget.order['mediaFileViewModels'] ?? [],
      };

      try {
        final response = await http.put(
          Uri.parse('https://localhost:44315/Api/UpdateOrder'),
          headers: {
            'Content-Type': 'application/json',
          },
          body: jsonEncode(updatedOrder),
        );

        if (response.statusCode == 200) {
          Navigator.pop(context, 'Order updated successfully');
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed to update order: ${response.body}')),
          );
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('An error occurred: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text('Edit Order: ${widget.order['orderId']}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
                const SizedBox(height: 16.0),
                TextFormField(
                  controller: _priorityLevelController,
                  decoration: const InputDecoration(labelText: 'Priority Level'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a priority level';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 8.0),
                TextFormField(
                  controller: _specialRequirementsController,
                  decoration: const InputDecoration(labelText: 'Special Requirements'),
                ),
                const SizedBox(height: 8.0),
                TextFormField(
                  controller: _dueDateController,
                  decoration: const InputDecoration(labelText: 'Due Date'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a due date';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 8.0),
                TextFormField(
                  controller: _emergencyNumberController,
                  decoration: const InputDecoration(labelText: 'Emergency Number'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter an emergency number';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 8.0),
                TextFormField(
                  controller: _mouthAreaController,
                  decoration: const InputDecoration(labelText: 'Mouth Area'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter the mouth area';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 8.0),
                TextFormField(
                  controller: _estimatedDurationController,
                  decoration: const InputDecoration(labelText: 'Estimated Duration (Days)'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter the estimated duration';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 8.0),
                TextFormField(
                  controller: _medicalAidNumberController,
                  decoration: const InputDecoration(labelText: 'Medical Aid Number'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a medical aid number';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 8.0),
                ElevatedButton(
                  onPressed: _saveChanges,
                  child: const Text('Save Changes'),
                ),
                const SizedBox(height: 8.0),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                  },
                  child: const Text('Cancel'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
