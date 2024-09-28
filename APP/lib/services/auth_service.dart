import 'dart:convert';
// import 'dart:ffi';
import 'package:biopromobileflutter/main.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart'; // Import shared_preferences

class AuthService {
  final String apiUrl = 'https://localhost:44315'; // Your API base URL
  String? token;
  List<String> roles = [];
  int? employeeID=0;
  // Remove the client initialization from here to avoid circular reference
  // AuthenticatedHttpClient httpClient; 

  Future<Map<String, dynamic>> login(String email, String password, AuthenticatedHttpClient httpClient) async {
    final url = Uri.parse('$apiUrl/Login');
    final response = await http.post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'Emailaddress': email,
        'Password': password,
      }),
    );

    if (response.statusCode == 201) {
      final responseBody = jsonDecode(response.body);
      final token = responseBody['token'];
      await _saveToken(token);

      // Fetch the roles using sendRequest
      final rolesResponse = await httpClient.sendRequest('GET', 'GetSignInProfile/$email');
      if (rolesResponse.statusCode == 200) {
        final responseBody = jsonDecode(rolesResponse.body);
        roles = List<String>.from(responseBody['roles']);

        await _saveRoles(roles); 
        if(responseBody['employees']['employeeId']!=null)
        {
          await _saveEmployeeID(responseBody['employees']['employeeId']);
        }
        // Save roles to SharedPreferences
       responseBody['roles'] = roles;
      } else {
        throw Exception('Failed to fetch roles');
      }

      return responseBody;
    } else if (response.statusCode == 400) {
      throw Exception('Invalid login credentials');
    } else {
      throw Exception('Failed to log in');
    }
  }
  Future<void> _saveRoles(List<String> roles) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setStringList('userRoles', roles);
}
Future<void> _saveEmployeeID(int employeeID) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setInt('employeeID',employeeID);
}

Future<List<String>?> getRoles() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getStringList('userRoles');
}
Future<int?> getEmployeeID() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getInt('employeeID');
}


  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('authToken', token);
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('authToken');
  }
}


class AuthenticatedHttpClient {
  final String baseUrl;
  final AuthService authService;

  AuthenticatedHttpClient({
    required this.baseUrl,
    required this.authService,
  });

  Future<http.Response> sendRequest(
    String method,
    String endpoint, {
    Map<String, String>? headers,
    Object? body,
  }) async {
    final uri = Uri.parse('$baseUrl/$endpoint');
    final authToken = await authService.getToken(); // Get token from AuthService

    final requestHeaders = {
      'Authorization': 'Bearer $authToken',
      'Content-Type': 'application/json',
      ...?headers,
    };

    http.Response response;

    try {
      switch (method.toUpperCase()) {
        case 'POST':
          response = await http.post(uri, headers: requestHeaders, body: jsonEncode(body));
          break;
        case 'PUT':
          response = await http.put(uri, headers: requestHeaders, body: jsonEncode(body));
          break;
        case 'DELETE':
          response = await http.delete(uri, headers: requestHeaders);
          break;
        case 'GET':
        default:
          response = await http.get(uri, headers: requestHeaders);
          break;
      }

      if (response.statusCode == 401) {
        // Handle unauthorized error
        _showUnauthorizedError();
      }
      if (response.statusCode == 403) {
        throw Exception('Unauthorized');
      }

      if (response.statusCode >= 400) {
        throw Exception('Failed with status code: ${response.statusCode}');
      }

      return response;
    } catch (e) {
      print('Error in sendRequest: $e');
      rethrow; // Rethrow to be caught by outer try-catch
    }
  }
}


  void _showUnauthorizedError() {
    showDialog(
      context: navigatorKey.currentContext!,
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
                Navigator.pushReplacementNamed(context, '/login');
              },
            ),
          ],
        );
      },
    );
  }
