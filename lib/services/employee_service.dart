import 'dart:convert';
import 'package:http/http.dart' as http;

class EmployeeService {
  final String baseUrl;

  EmployeeService({required this.baseUrl});

  Future<void> captureDailyHours(int employeeId, Map<String, dynamic> dailyHours) async {
    final response = await http.post(
      Uri.parse('$baseUrl/capture-daily-hours/$employeeId'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(dailyHours),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to capture daily hours');
    }
  }
}
