import 'dart:convert';
import 'package:http/http.dart' as http;
import 'auth_service.dart'; // Import the file containing AuthService

class EmployeeHoursCaptureService {
  final AuthenticatedHttpClient httpClient;

  EmployeeHoursCaptureService({
    required this.httpClient,
  });

  Future<void> captureDailyHours({
    required String employeeId,
    required double totalHours,
  }) async {
    final String endpoint = 'api/Employee/capture-daily-hours/$employeeId';

    final Map<String, dynamic> data = {
      "employeeDailyHoursId": 0,
      "employeeId": int.parse(employeeId),
      "workDate": DateTime.now().toIso8601String(),
      "hours": totalHours,
    };

    print('Sending the following data to $endpoint:');
    print(jsonEncode(data));

    try {
      final response = await httpClient.sendRequest(
        'POST',
        endpoint,
        body: data,
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
