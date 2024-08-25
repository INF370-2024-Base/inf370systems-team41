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
  List<dynamic> mediaFiles = [];

  @override
  void initState() {
    super.initState();
    _priorityLevelController =
        TextEditingController(text: widget.order['priorityLevel'] ?? '');
    _specialRequirementsController =
        TextEditingController(text: widget.order['specialRequirements'] ?? '');
    _dueDateController = TextEditingController(text: widget.order['dueDate'] ?? '');
    _emergencyNumberController =
        TextEditingController(text: widget.order['emergencyNumber'] ?? '');
    _mouthAreaController =
        TextEditingController(text: widget.order['mouthArea'] ?? '');
    _estimatedDurationController = TextEditingController(
        text: widget.order['estimatedDurationInDays']?.toString() ?? '');
    _medicalAidNumberController =
        TextEditingController(text: widget.order['patientMedicalAidNumber'] ?? '');
    selectedAreasIds = widget.order['selectedAreasIds']?.cast<int>() ?? [];

    _fetchMediaFiles();
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

  Future<void> _fetchMediaFiles() async {
    final url = 'https://localhost:44315/Api/GetAllOrderInfo/${widget.order['orderId']}';
    try {
      print('Fetching media files from $url');
      final response = await http.get(Uri.parse(url));

      print('Response status code: ${response.statusCode}');
      if (response.statusCode == 200) {
        final decodedResponse = jsonDecode(response.body);
        print('Response body: $decodedResponse');
        setState(() {
          mediaFiles = decodedResponse['mediaFiles'] ?? [];
        });
      } else {
        print('Failed to load media files: ${response.body}');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Failed to load media files: ${response.body}')),
        );
      }
    } catch (e) {
      print('Exception occurred while fetching media files: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text('An error occurred while fetching media files: $e')),
      );
    }
  }

  Future<void> _pickImage() async {
    try {
      final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
      if (pickedFile != null) {
        setState(() {
          _selectedImage = pickedFile;
        });
        print('Selected image: ${pickedFile.path}');
      } else {
        print('No image selected.');
      }
    } catch (e) {
      print('Error picking image: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('An error occurred while picking the image: $e')),
      );
    }
  }

  Future<void> _saveChanges() async {
    if (_formKey.currentState!.validate()) {
      if (_selectedImage != null) {
        try {
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

          print('Submitting media file with request body: $requestBody');

          final response = await http.post(
            Uri.parse('https://localhost:44315/Api/AddMediaFile'),
            headers: {
              'Content-Type': 'application/json',
            },
            body: jsonEncode(requestBody),
          );

          print('Response status code: ${response.statusCode}');
          if (response.statusCode == 200) {
            print('Media file attached successfully.');
            showDialog(
              context: context,
              builder: (BuildContext context) {
                return AlertDialog(
                  title: Text('Success'),
                  content: Text('Media file attached successfully.'),
                  actions: <Widget>[
                    TextButton(
                      child: Text('OK'),
                      onPressed: () {
                        Navigator.of(context).pop();
                        Navigator.of(context)
                            .pop('Media file added successfully');
                      },
                    ),
                  ],
                );
              },
            );
          } else {
            print('Failed to add media file: ${response.body}');
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                  content: Text('Failed to add media file: ${response.body}')),
            );
          }
        } catch (e) {
          print('Exception occurred while saving media file: $e');
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('An error occurred: $e')),
          );
        }
      } else {
        print('No image selected for upload.');
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
                Text('Order: ${widget.order['orderId'] ?? ''}',
                    style: const TextStyle(
                        fontWeight: FontWeight.bold, fontSize: 20)),
                const SizedBox(height: 16.0),
                TextFormField(
                  controller: _priorityLevelController,
                  readOnly: true,
                  decoration:
                      const InputDecoration(labelText: 'Priority Level'),
                ),
                const SizedBox(height: 8.0),
                TextFormField(
                  controller: _specialRequirementsController,
                  readOnly: true,
                  decoration:
                      const InputDecoration(labelText: 'Special Requirements'),
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
                  decoration:
                      const InputDecoration(labelText: 'Emergency Number'),
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
                  decoration: const InputDecoration(
                      labelText: 'Estimated Duration (Days)'),
                ),
                const SizedBox(height: 8.0),
                TextFormField(
                  controller: _medicalAidNumberController,
                  readOnly: true,
                  decoration:
                      const InputDecoration(labelText: 'Medical Aid Number'),
                ),
                const SizedBox(height: 16.0),
                if (mediaFiles.isNotEmpty)
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: mediaFiles.map((mediaFile) {
                      try {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 8.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('File Name: ${mediaFile['fileName'] ?? 'Unknown'}'),
                              if (mediaFile['fileSelf'] != null)
                                Image.memory(
                                  base64Decode(mediaFile['fileSelf']),
                                  height: 100,
                                  fit: BoxFit.cover,
                                  errorBuilder: (context, error, stackTrace) {
                                    return Text('Error displaying image: $error');
                                  },
                                )
                              else
                                Text('No image data available.'),
                            ],
                          ),
                        );
                      } catch (e) {
                        print('Error decoding image for file ${mediaFile['fileName']}: $e');
                        return Text('Error decoding image: $e');
                      }
                    }).toList(),
                  ),
                const SizedBox(height: 16.0),
                _selectedImage != null
                    ? kIsWeb
                        ? Image.network(_selectedImage!.path)
                        : Image.file(File(_selectedImage!.path))
                    : const Text('No image selected'),
                const SizedBox(height: 8.0),
                Row(
                  children: [
                    ElevatedButton(
                      onPressed: _pickImage,
                      child: const Text('Attach Image'),
                    ),
                    Spacer(),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: const Text('Cancel'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                      ),
                    ),
                    const SizedBox(width: 8.0),
                    ElevatedButton(
                      onPressed: _saveChanges,
                      child: const Text('Save'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
