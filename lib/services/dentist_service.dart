import 'dart:convert';
import 'package:http/http.dart' as http;

class DentistService {
  final String baseUrl;

  DentistService({required this.baseUrl});

  Future<List<dynamic>> fetchDentists() async {
    final response = await http.get(Uri.parse('$baseUrl/GetAllDentists'));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load dentists');
    }
  }
}
