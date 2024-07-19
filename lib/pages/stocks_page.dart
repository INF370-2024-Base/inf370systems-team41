import 'package:flutter/material.dart';
import '../services/stock_service.dart';
import 'components/stock_card.dart';

class StocksPage extends StatefulWidget {
  @override
  _StocksPageState createState() => _StocksPageState();
}

class _StocksPageState extends State<StocksPage> {
  late Future<List<dynamic>> futureStocks;
  final StockService stockService = StockService(baseUrl: 'https://localhost:44315/stock');

  @override
  void initState() {
    super.initState();
    futureStocks = stockService.fetchStocks();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Stocks'),
      ),
      body: Container(
        color: const Color(0xFF8B9AAD),
        child: FutureBuilder<List<dynamic>>(
          future: futureStocks,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return const Center(child: Text('No stocks found'));
            } else {
              final stockItems = snapshot.data!;
              return Scrollbar(
                child: ListView.builder(
                  padding: const EdgeInsets.all(10.0),
                  itemCount: stockItems.length,
                  itemBuilder: (context, index) {
                    final stockItem = stockItems[index];
                    return StockCard(stockItem: stockItem);
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
