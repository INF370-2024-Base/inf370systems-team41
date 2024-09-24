import 'package:flutter/material.dart';
import 'package:biopromobileflutter/services/auth_service.dart';
import 'package:biopromobileflutter/services/stock_service.dart';
import 'components/stock_card.dart';
import 'package:shared_preferences/shared_preferences.dart';
class StocksPage extends StatefulWidget {
  @override
  _StocksPageState createState() => _StocksPageState();
}

class _StocksPageState extends State<StocksPage> {
  late Future<List<dynamic>> futureStocks;
  late StockService stockService;
  late AuthService authService;
  List<String> roles = [];

  @override
  void initState() {
    super.initState();
    _initializeServices();
  }

  Future<void> _initializeServices() async {
    authService = AuthService();
    roles = await authService.getRoles() ?? []; // Retrieve and store roles
    print(roles); // Debug print to check roles

    final authenticatedClient = AuthenticatedHttpClient(
      baseUrl: 'https://localhost:44315/stock',
      authService: authService,
    );

    stockService = StockService(
      baseUrl: 'stock',
      client: authenticatedClient,
    );

    futureStocks = stockService.fetchStocks();
    setState(() {});
  }

  void handleWriteOffStock(Map<String, dynamic> writeOffData) async {
    try {
      await stockService.writeOffStock(writeOffData);
      setState(() {
        futureStocks = stockService.fetchStocks(); // Refresh stock list
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Stock successfully written off')),
      );
    } catch (error) {
      if (error is UnauthorizedException) {
        _showUnauthorizedError();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to write off stock: $error')),
        );
      }
    }
  }

  void _showUnauthorizedError() {
    if (Navigator.of(context).canPop()) {
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
                },
              ),
            ],
          );
        },
      );
    }
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
                    return StockCard(
                      stockItem: stockItem,
                      roles: roles, // Pass the roles list
                      onWriteOff: handleWriteOffStock,
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

Future<List<String>?> getRoles() async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getStringList('userRoles');
}
