import 'package:biopromobileflutter/services/stock_service.dart';
import 'package:flutter/material.dart';
import 'package:biopromobileflutter/services/auth_service.dart';
import 'package:biopromobileflutter/services/order_service.dart';
import 'components/edit_order_modal.dart';
import 'components/order_component.dart';

class OrdersPage extends StatefulWidget {
  @override
  _OrdersPageState createState() => _OrdersPageState();
}

class _OrdersPageState extends State<OrdersPage> {
  late Future<List<dynamic>> futureOrders;
  late OrderService orderService;

  @override
  void initState() {
    super.initState();

    final authService = AuthService(); // Initialize your AuthService here
    final httpClient = AuthenticatedHttpClient(
      baseUrl: 'https://localhost:44315/api',
      authService: authService,
    );

    orderService = OrderService(httpClient: httpClient);

    futureOrders = orderService.fetchOrders();
  }

 @override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: const Text('Orders'),
    ),
    body: Container(
      color: const Color(0xFF8B9AAD),
      child: FutureBuilder<List<dynamic>>(
        future: futureOrders,
        builder: (context, snapshot) {
          // Handle loading state
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          // Handle error state
          if (snapshot.hasError) {
            if (snapshot.error is UnauthorizedException) {
              _showUnauthorizedError();
            } else {
              return Center(child: Text('Error: ${snapshot.error}'));
            }
          }

          // Handle no data state
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No orders found'));
          }

          // Handle data state
          final orders = snapshot.data!;
          return ListView.builder(
            padding: const EdgeInsets.all(10.0),
            itemCount: orders.length,
            itemBuilder: (context, index) {
              final order = orders[index];
              return OrderComponent(
                order: order,
                onTap: () {
                  showModalBottomSheet(
                    context: context,
                    builder: (context) => EditOrderModal(order: order),
                  );
                },
              );
            },
          );
        },
      ),
    ),
  );
}




  void _showUnauthorizedError() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Unauthorized'),
          content: Text('Your session has expired or you are not authorized. Please log in again.'),
          actions: <Widget>[
            TextButton(
              child: Text('OK'),
              onPressed: () {
                Navigator.of(context).pop();
                // Optionally navigate to login screen
                // Navigator.pushReplacementNamed(context, '/login');
              },
            ),
          ],
        );
      },
    );
  }
}
