import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  final String apiUrl = 'https://localhost:44315'; 

  Future<Map<String, dynamic>> login(String email, String password) async {
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

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else if (response.statusCode == 400) {
      throw Exception('Invalid login credentials');
    } else {
      throw Exception('Failed to log in');
    }
  }
}
