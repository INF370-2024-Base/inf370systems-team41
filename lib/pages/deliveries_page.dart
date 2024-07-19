import 'package:flutter/material.dart';
import 'package:biopromobileflutter/services/delivery_service.dart';
import 'components/delivery_card.dart';

class DeliveriesPage extends StatefulWidget {
  const DeliveriesPage({super.key});

  @override
  _DeliveriesPageState createState() => _DeliveriesPageState();
}

class _DeliveriesPageState extends State<DeliveriesPage> {
  late Future<List<dynamic>> futureDeliveries;
  final DeliveryService deliveryService = DeliveryService(baseUrl: 'https://localhost:44315/delivery');

  @override
  void initState() {
    super.initState();
    futureDeliveries = deliveryService.fetchDeliveries();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Deliveries'),
      ),
      body: Container(
        color: const Color(0xFF8B9AAD),
        child: FutureBuilder<List<dynamic>>(
          future: futureDeliveries,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return const Center(child: Text('No deliveries found'));
            } else {
              final deliveries = snapshot.data!;
              return Scrollbar(
                child: ListView.builder(
                  padding: const EdgeInsets.all(10.0),
                  itemCount: deliveries.length,
                  itemBuilder: (context, index) {
                    final delivery = deliveries[index];
                    return DeliveryCard(
                      delivery: {
                        'deliveryId': delivery['deliveryId'].toString(),
                        'status': delivery['deliveryStatus']['statusName'],
                        'employee': '${delivery['employee']['firstName']} ${delivery['employee']['lastName']}',
                        'orderId': delivery['systemOrderId'].toString(),
                      },
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
