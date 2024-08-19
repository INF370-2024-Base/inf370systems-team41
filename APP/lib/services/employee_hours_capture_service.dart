import 'dart:convert';
import 'package:http/http.dart' as http;

class EmployeeHoursCaptureService {
  final String baseUrl;

  EmployeeHoursCaptureService({required this.baseUrl});

  Future<void> captureDailyHours({
    required String employeeId,
    required double totalHours,
  }) async {
    final String apiUrl = '$baseUrl/api/Employee/capture-daily-hours/$employeeId';

    final Map<String, dynamic> data = {
      "employeeDailyHoursId": 0,
      "employeeId": int.parse(employeeId),
      "workDate": DateTime.now().toIso8601String(),
      "hours": totalHours,
    };

    print('Sending the following data to $apiUrl:');
    print(jsonEncode(data));

    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(data),
      );

      if (response.statusCode == 200) {
        print('Time successfully captured.');
      } else {
        print('Failed to capture time: ${response.body}');
        throw Exception('Failed to capture time: ${response.body}');
      }
    } catch (e) {
      print('Error: $e');
      throw Exception('An error occurred: $e');
    }
  }
}
