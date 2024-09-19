import 'dart:convert';
import 'package:http/http.dart' as http;

class StockService {
  final String baseUrl;

  StockService({required this.baseUrl});

  Future<List<dynamic>> fetchStocks() async {
    final response = await http.get(Uri.parse('$baseUrl/GetAllStock'));

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load stocks');
    }
  }

  Future<void> writeOffStock(Map<String, dynamic> writeOffData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/WriteOffStock'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(writeOffData),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to write off stock');
    }
  }
}