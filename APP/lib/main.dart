import 'package:biopromobileflutter/pages/timer_component.dart';
import 'package:biopromobileflutter/pages/deliveries_page.dart';
import 'package:biopromobileflutter/pages/dentists_page.dart';
import 'package:biopromobileflutter/pages/help_page.dart';
import 'package:biopromobileflutter/pages/login_page.dart';
import 'package:biopromobileflutter/pages/orders_page.dart';
import 'package:biopromobileflutter/pages/qr_code_scanner_page.dart';
import 'package:biopromobileflutter/pages/stocks_page.dart';
import 'package:biopromobileflutter/services/auth_service.dart';
import 'package:biopromobileflutter/services/timer_service.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:provider/single_child_widget.dart';
import 'package:shared_preferences/shared_preferences.dart';
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

void main() {
  runApp(
    MultiProvider(
      providers: [
        Provider<AuthService>(create: (_) => AuthService()),
        ChangeNotifierProvider<TimerService>(create: (_) => TimerService()),
      ],
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  final AuthService authService = AuthService(); // Create AuthService instance

  Future<List<String>> _getRoles() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getStringList('userRoles') ?? [];
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<String>>(
      future: _getRoles(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return MaterialApp(
            home: Scaffold(
              body: Center(child: CircularProgressIndicator()),
            ),
          );
        } else if (snapshot.hasError) {
          return MaterialApp(
            home: Scaffold(
              body: Center(child: Text('Error: ${snapshot.error}')),
            ),
          );
        } else {
          final roles = snapshot.data ?? [];
          return MaterialApp(
            title: 'BioPro Mobile Flutter',
            theme: ThemeData(
              primarySwatch: Colors.blue,
            ),
            home: BioProLoginPage(authService: authService), // Pass roles to MyHomePage
          );
        }
      },
    );
  }
}

class MyHomePage extends StatelessWidget {
  final AuthService authService; // Add this line
  final List<String>? roles; // Add this line
  final ValueNotifier<Duration> workedHoursNotifier = ValueNotifier(Duration.zero);

  // Update the constructor to accept authService and roles
  MyHomePage({required this.authService, required this.roles});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: <Widget>[
          Image.asset('assets/back2.jpg', fit: BoxFit.cover),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Image.asset('assets/logo.jpg', width: 150, height: 150),
              const SizedBox(height: 20),
              
              NavigationButton(text: 'Stocks', page: StocksPage()),
              if (roles?.any((role) => ['Admin', 'Owner', 'Lab Manager'].contains(role)) ?? false)
                NavigationButton(text: 'Deliveries', page: DeliveriesPage()),
              if (roles?.any((role) => ['Admin', 'Owner', 'Lab Manager'].contains(role)) ?? false)
                NavigationButton(text: 'Dentists', page: DentistsPage()),
              NavigationButton(text: 'Orders', page: OrdersPage()),
              NavigationButton(text: 'Help', page: HelpPage()),

              NavigationButton(
                text: 'Login',
                page: BioProLoginPage(authService: authService),
              ),

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
