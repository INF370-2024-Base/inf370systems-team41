// ignore_for_file: use_build_context_synchronously

import 'package:biopromobileflutter/pages/components/edit_order_modal.dart';
import 'package:biopromobileflutter/services/order_service.dart';
import 'package:flutter/material.dart';

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
  }

  Future<void> _refreshOrders() async {
    setState(() {
      futureOrders = orderService.fetchOrders();
    });
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
              return Scrollbar(
                child: ListView.builder(
                  padding: const EdgeInsets.all(10.0),
                  itemCount: orders.length,
                  itemBuilder: (context, index) {
                    final order = orders[index];
                    return Card(
                      child: ListTile(
                        leading: const Icon(Icons.description),
                        title: Text('Order ID: ${order['orderId']} - Patient: ${order['patientName']} ${order['patientSurname']}'),
                        trailing: const Icon(Icons.expand_more),
                        onTap: () async {
                          final result = await showModalBottomSheet<String>(
                            context: context,
                            isScrollControlled: true,
                            builder: (BuildContext context) {
                              return OrderEditModal(order: order);
                            },
                          );
                          if (result != null) {
                            _refreshOrders();
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(result)),
                            );
                          }
                        },
                      ),
                    );
                  },
                ),
              );
            }
          },
        ),
      ),
    );
  }
}
