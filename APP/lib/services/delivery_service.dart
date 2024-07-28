import 'dart:convert';
import 'package:http/http.dart' as http;

class DeliveryService {
  final String baseUrl;

  DeliveryService({required this.baseUrl});

  Future<List<dynamic>> fetchDeliveries() async {
    final response = await http.get(Uri.parse('$baseUrl/GetDeliveries'));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load deliveries');
    }
  }
}
