import 'package:flutter/material.dart';

void showUnauthorizedError(BuildContext context) {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: Text('Unauthorized'),
        content: Text('Your session has expired or you are not authorized. Please log in with correct permissions.'),
        actions: <Widget>[
          TextButton(
            child: Text('OK'),
            onPressed: () {
              Navigator.of(context).pop();
              // Optionally navigate to login screen
              // Navigator.pushReplacementNamed(context, '/login');
            },
          ),
        ],
      );
    },
  );
}
