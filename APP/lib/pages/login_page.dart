import 'package:flutter/material.dart';
import 'package:flutter_login/flutter_login.dart';
import 'package:biopromobileflutter/main.dart';
import 'package:biopromobileflutter/services/auth_service.dart'; 
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class BioProLoginPage extends StatelessWidget {
  final storage = FlutterSecureStorage();

  BioProLoginPage({Key? key}) : super(key: key);

  Duration get loginTime => Duration(milliseconds: 2250);

  Future<String?> _authUser(LoginData data, BuildContext context) async {
    try {
      AuthService authService = AuthService();
      final response = await authService.login(data.name, data.password);

      await storage.write(key: 'token', value: response['token']);

      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => MyHomePage()),
      );
      return null;
    } catch (e) {
      return e.toString();
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
    );
  }
}
