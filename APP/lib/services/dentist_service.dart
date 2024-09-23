import 'dart:convert';
import 'package:biopromobileflutter/services/stock_service.dart';
import 'package:flutter/material.dart';
import 'package:biopromobileflutter/services/auth_service.dart'; // Adjust import path
import 'package:biopromobileflutter/services/error_utils.dart'; // Adjust import path

class DentistService {
  final AuthenticatedHttpClient httpClient;

  DentistService({
    required String baseUrl,
    required AuthService authService,
  }) : httpClient = AuthenticatedHttpClient(
          baseUrl: baseUrl,
          authService: authService,
        );

  Future<List<dynamic>> fetchDentists(BuildContext context) async {
    try {
      final response = await httpClient.sendRequest('GET', 'GetAllDentists');

      if (response.statusCode == 200) {
        return List<dynamic>.from(json.decode(response.body));
      } else if (response.statusCode == 403) {
        // Handle unauthorized access here
        throw UnauthorizedException();
      } else {
        throw Exception('Failed to load dentists');
      }
    } catch (error) {
      if (error is UnauthorizedException) {
        showUnauthorizedError(context);
      }
      rethrow; // Re-throw the exception after handling it
    }
  }
}
