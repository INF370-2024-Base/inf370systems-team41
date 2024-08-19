import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:flutter/foundation.dart' show kIsWeb;

class EditOrderModal extends StatefulWidget {
  final Map<String, dynamic> order;

  EditOrderModal({required this.order});

  @override
  _EditOrderModalState createState() => _EditOrderModalState();
}

class _EditOrderModalState extends State<EditOrderModal> {
  final _formKey = GlobalKey<FormState>();
  final ImagePicker _picker = ImagePicker();
  XFile? _selectedImage;

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

  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      setState(() {
        _selectedImage = pickedFile;
      });
    }
  }

  Future<void> _saveChanges() async {
    if (_formKey.currentState!.validate()) {
      if (_selectedImage != null) {
        final bytes = await _selectedImage!.readAsBytes();
        final base64Image = base64Encode(bytes);

        final requestBody = {
          "mediaFileViewModels": [
            {
              "systemOrderId": widget.order['orderId'], 
              "fileName": _selectedImage!.name,
              "fileSelf": base64Image,
              "fileSizeKb": (bytes.length / 1024).toString(), 
            }
          ],
          "orderId": widget.order['orderId'],
        };

        try {
          final response = await http.post(
            Uri.parse('https://localhost:44315/Api/AddMediaFile'),
            headers: {
              'Content-Type': 'application/json',
            },
            body: jsonEncode(requestBody),
          );

          if (response.statusCode == 200) {
            Navigator.pop(context, 'Media file added successfully');
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Failed to add media file: ${response.body}')),
            );
          }
        } catch (e) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('An error occurred: $e')),
          );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Please select an image to attach.')),
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
                  readOnly: true,  
                  decoration: const InputDecoration(labelText: 'Priority Level'),
                ),
                const SizedBox(height: 8.0),
                TextFormField(
                  controller: _specialRequirementsController,
                  readOnly: true,  
                  decoration: const InputDecoration(labelText: 'Special Requirements'),
                ),
                const SizedBox(height: 8.0),
                TextFormField(
                  controller: _dueDateController,
                  readOnly: true,  
                  decoration: const InputDecoration(labelText: 'Due Date'),
                ),
                const SizedBox(height: 8.0),
                TextFormField(
                  controller: _emergencyNumberController,
                  readOnly: true, 
                  decoration: const InputDecoration(labelText: 'Emergency Number'),
                ),
                const SizedBox(height: 8.0),
                TextFormField(
                  controller: _mouthAreaController,
                  readOnly: true,  
                  decoration: const InputDecoration(labelText: 'Mouth Area'),
                ),
                const SizedBox(height: 8.0),
                TextFormField(
                  controller: _estimatedDurationController,
                  readOnly: true,  
                  decoration: const InputDecoration(labelText: 'Estimated Duration (Days)'),
                ),
                const SizedBox(height: 8.0),
                TextFormField(
                  controller: _medicalAidNumberController,
                  readOnly: true, 
                  decoration: const InputDecoration(labelText: 'Medical Aid Number'),
                ),
                const SizedBox(height: 16.0),
                _selectedImage != null
                    ? kIsWeb
                        ? Image.network(_selectedImage!.path)
                        : Image.file(File(_selectedImage!.path))
                    : const Text('No image selected'),
                const SizedBox(height: 8.0),
                ElevatedButton(
                  onPressed: _pickImage,
                  child: const Text('Attach Image'),
                ),
                const SizedBox(height: 16.0),
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
