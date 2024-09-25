import 'package:biopromobileflutter/pages/stocks_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_login/flutter_login.dart';
import 'package:biopromobileflutter/main.dart';
import 'package:biopromobileflutter/services/auth_service.dart'; 
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class BioProLoginPage extends StatelessWidget {
  final storage = FlutterSecureStorage();

  BioProLoginPage({Key? key, required AuthService authService}) : super(key: key);

  Duration get loginTime => Duration(milliseconds: 2250);

  Future<String?> _authUser(LoginData data, BuildContext context) async {
  try {
    // Create instances of AuthService and AuthenticatedHttpClient
    AuthService authService = AuthService();
    AuthenticatedHttpClient httpClient = AuthenticatedHttpClient(
      baseUrl: 'https://localhost:44315', // Your API base URL
      authService: authService, // Pass the authService here
    );

    // Call login with the required 3 arguments
    final response = await authService.login(data.name, data.password, httpClient);

    // Save the token in secure storage
    await storage.write(key: 'token', value: response['token']);
    final theRoles= await getRoles();
    // Navigate to the home page
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (context) => MyHomePage(authService: authService,roles: theRoles,)),
    );

    return null;
  } catch (e) {
    return e.toString(); // Return the error message to display in the login UI
  }
}

  Future<String?> _authSignup(SignupData data, BuildContext context) async {
    return await _authUser(LoginData(name: data.name!, password: data.password!), context);
  }

  Future<String?> _recoverPassword(String name) async {
    return Future.delayed(loginTime).then((_) {
      return 'Password recovery not implemented';
    });
  }
  

  @override
  Widget build(BuildContext context) {
    return FlutterLogin(
      title: 'BioPro Dental Studio',
      logo: AssetImage('assets/logo.jpg'), 
      onLogin: (loginData) => _authUser(loginData, context),
      onSignup: (signupData) => _authSignup(signupData, context), 
      onRecoverPassword: _recoverPassword,
      theme: LoginTheme(
        primaryColor: const Color(0xFF8B9AAD), 
        accentColor: Colors.white,
        pageColorLight: const Color(0xFF8B9AAD),
        pageColorDark: const Color(0xFF8B9AAD),
        titleStyle: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),
        logoWidth: 100.0, 
        beforeHeroFontSize: 40, 
        afterHeroFontSize: 20, 
      ),
      additionalSignupFields: [],
      hideForgotPasswordButton: true,
    );
  }
}
