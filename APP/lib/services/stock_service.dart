import 'dart:convert';
import 'package:biopromobileflutter/services/auth_service.dart';
import 'package:http/http.dart' as http;


class UnauthorizedException implements Exception {}

class StockService {
  final AuthenticatedHttpClient client;
  final String baseUrl;

  StockService({
    required this.baseUrl,
    required this.client,
  });

  Future<List<dynamic>> fetchStocks() async {
    final response = await client.sendRequest('GET', 'GetAllStock');

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else if (response.statusCode == 403) {
      throw UnauthorizedException();
    } else {
      throw Exception('Failed to load stocks');
    }
  }

  Future<void> writeOffStock(Map<String, dynamic> writeOffData) async {
    final response = await client.sendRequest(
      'POST',
      'WriteOffStock',
      body: writeOffData,
    );

    if (response.statusCode == 403) {
      throw UnauthorizedException();
    } else if (response.statusCode != 200) {
      throw Exception('Failed to write off stock');
    }
  }
}
