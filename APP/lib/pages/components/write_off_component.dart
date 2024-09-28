import 'package:flutter/material.dart';

class WriteOffDialog extends StatefulWidget {
  final int stockId;
  final String stockName;

  WriteOffDialog({required this.stockId, required this.stockName});

  @override
  _WriteOffDialogState createState() => _WriteOffDialogState();
}

class _WriteOffDialogState extends State<WriteOffDialog> {
  final _formKey = GlobalKey<FormState>();
  final _quantityController = TextEditingController();
  String? _selectedReason;

  final List<String> _reasons = [
    'Damaged',
    'Expired',
    'Lost',
    'Other'
  ];

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Write Off Stock: ${widget.stockName}'),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            TextFormField(
              controller: _quantityController,
              decoration: InputDecoration(labelText: 'Quantity to Write Off'),
              keyboardType: TextInputType.number,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please enter a quantity';
                }
                return null;
              },
            ),
            DropdownButtonFormField<String>(
              value: _selectedReason,
              items: _reasons.map((String reason) {
                return DropdownMenuItem<String>(
                  value: reason,
                  child: Text(reason),
                );
              }).toList(),
              onChanged: (newValue) {
                setState(() {
                  _selectedReason = newValue;
                });
              },
              decoration: InputDecoration(labelText: 'Reason for Write Off'),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Please select a reason';
                }
                return null;
              },
            ),
          ],
        ),
      ),
      actions: <Widget>[
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            if (_formKey.currentState!.validate()) {
              final writeOffData = {
                'stockId': widget.stockId,
                'quantityWrittenOff': int.parse(_quantityController.text),
                'reason': _selectedReason
              };
              Navigator.of(context).pop(writeOffData);
            }
          },
          child: Text('Submit'),
        ),
      ]
     );
     }
}