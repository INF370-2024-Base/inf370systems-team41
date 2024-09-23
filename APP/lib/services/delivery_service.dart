import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:biopromobileflutter/services/auth_service.dart'; // Import AuthService
import 'package:biopromobileflutter/main.dart'; // Import navigatorKey
import 'error_utils.dart';

class DeliveryService {
  final AuthService authService;
  final String baseUrl;
  final BuildContext context;

  DeliveryService({
    required this.authService,
    required this.baseUrl,
    required this.context,
  });

  Future<List<Map<String, dynamic>>> fetchDeliveries() async {
    final client = AuthenticatedHttpClient(
      baseUrl: baseUrl,
      authService: authService,
    );

    try {
      final response = await client.sendRequest('GET', 'GetDeliveries'); // Use sendRequest
      print(response.statusCode);
      if (response.statusCode == 200) {
        return List<Map<String, dynamic>>.from(json.decode(response.body));
      } else if (response.statusCode == 403) {
        showUnauthorizedError(context); // Pass context here
        throw Exception('Unauthorized');
      } else {
        throw Exception(response.statusCode);
        
      }
    } catch (e) {
      // Handle other exceptions or errors
      throw Exception('Failed to load deliveriess: $e');
    }
  }
}
