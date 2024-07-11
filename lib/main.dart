import 'package:flutter/material.dart';
import 'pages/stocks_page.dart';
import 'pages/deliveries_page.dart';
import 'pages/dentists_page.dart';
import 'pages/orders_page.dart';
import 'pages/qr_code_scanner_page.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BioPro Mobile Flutter',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: <Widget>[
          Image.asset(
            'assets/back2.jpg',
            fit: BoxFit.cover,
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Image.asset(
                'assets/logo.jpg',
                width: 150,
                height: 150,
              ),
              SizedBox(height: 20),
              NavigationButton(
                text: 'Stocks',
                page: StocksPage(),
              ),
              NavigationButton(
                text: 'Deliveries',
                page: DeliveriesPage(),
              ),
              NavigationButton(
                text: 'Dentists',
                page: DentistsPage(),
              ),
              NavigationButton(
                text: 'Orders',
                page: OrdersPage(),
              ),
            ],
          ),
        ],
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => QRCodeScannerPage()),
          );
        },
        child: Icon(Icons.camera_alt),
      ),
    );
  }
}

class NavigationButton extends StatelessWidget {
  final String text;
  final Widget page;

  NavigationButton({required this.text, required this.page});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 10.0),
      width: double.infinity,
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          padding: EdgeInsets.symmetric(vertical: 20.0),
        ),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => page),
          );
        },
        child: Text(text, style: TextStyle(fontSize: 18.0)),
      ),
    );
  }
}
