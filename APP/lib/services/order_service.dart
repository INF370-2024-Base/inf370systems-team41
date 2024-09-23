import 'dart:convert';
import 'package:biopromobileflutter/services/auth_service.dart';
import 'package:biopromobileflutter/services/stock_service.dart';
import 'package:flutter/material.dart';

class OrderService {
  final AuthenticatedHttpClient httpClient;

  OrderService({required this.httpClient});

  Future<List<dynamic>> fetchOrders() async {
    try {
      final response = await httpClient.sendRequest(
        'GET',
        'GetAllOrders',
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else if (response.statusCode == 401) {
        // Handle unauthorized error
        throw UnauthorizedException();
      } else {
        throw Exception('Failed to load orders');
      }
    } catch (e) {
      if (e is UnauthorizedException) {
        // Handle unauthorized error in UI
        throw UnauthorizedException();
      } else {
        throw Exception('Failed to load orders');
      }
    }
  }
}
