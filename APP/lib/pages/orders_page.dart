import 'package:biopromobileflutter/pages/components/edit_order_modal.dart';
import 'package:biopromobileflutter/pages/components/order_component.dart';
import 'package:flutter/material.dart';
import 'package:biopromobileflutter/services/order_service.dart';

class OrdersPage extends StatefulWidget {
  @override
  _OrdersPageState createState() => _OrdersPageState();
}

class _OrdersPageState extends State<OrdersPage> {
  late Future<List<dynamic>> futureOrders;
  final OrderService orderService = OrderService(baseUrl: 'https://localhost:44315/Api');

  @override
  void initState() {
    super.initState();
    futureOrders = orderService.fetchOrders();
    print('Submitting media file with request body: $futureOrders');
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
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return const Center(child: Text('No orders found'));
            } else {
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
            }
          },
        ),
      ),
    );
  }
}
