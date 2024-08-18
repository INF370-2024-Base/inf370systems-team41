import 'package:biopromobileflutter/pages/components/timer_component.dart';
import 'package:biopromobileflutter/pages/deliveries_page.dart';
import 'package:biopromobileflutter/pages/dentists_page.dart';
import 'package:biopromobileflutter/pages/help_page.dart';
import 'package:biopromobileflutter/pages/orders_page.dart';
import 'package:biopromobileflutter/pages/photo_upload.dart';
import 'package:biopromobileflutter/pages/qr_code_scanner_page.dart';
import 'package:biopromobileflutter/pages/stocks_page.dart';
import 'package:flutter/material.dart';


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
  final ValueNotifier<Duration> workedHoursNotifier = ValueNotifier(Duration.zero);

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
              const SizedBox(height: 20),
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
              NavigationButton(
                text: 'Help',
                page: HelpPage(),
              ),
              // NavigationButton(
              //   text: 'Photo Upload',
              //   page: PhotoUploadPage(),
              // ),
              ValueListenableBuilder<Duration>(
                valueListenable: workedHoursNotifier,
                builder: (context, workedHours, child) {
                  return TimerComponent(duration: workedHours);
                },
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
            MaterialPageRoute(
              builder: (context) => QRCodeScannerPage(
                workedHoursNotifier: workedHoursNotifier,
              ),
            ),
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
