import 'dart:convert';
import 'package:http/http.dart' as http;

class OrderService {
  final String baseUrl;

  OrderService({required this.baseUrl});

  Future<List<dynamic>> fetchOrders() async {
    final response = await http.get(Uri.parse('$baseUrl/GetAllOrders'));

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load orders');
    }
  }
}
