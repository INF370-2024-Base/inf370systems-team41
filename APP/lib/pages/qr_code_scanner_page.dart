import 'dart:convert';
import 'package:biopromobileflutter/services/auth_service.dart';
import 'package:biopromobileflutter/services/timer_service.dart';
import 'package:http/http.dart' as http;
import 'package:biopromobileflutter/services/employee_hours_capture_service.dart';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'timer_component.dart';
import 'package:provider/provider.dart';

class QRCodeScannerPage extends StatefulWidget {
  QRCodeScannerPage();

  @override
  _QRCodeScannerPageState createState() => _QRCodeScannerPageState();
}

class _QRCodeScannerPageState extends State<QRCodeScannerPage> {
  bool isScanning = true;
  bool isTimeCaptured = false;
  String? employeeId;
  Duration finalWorkDuration = Duration.zero;
  MobileScannerController scannerController = MobileScannerController();
  bool isCooldown = false;

  late final EmployeeHoursCaptureService _captureService;
  late final AuthService _authService;
  late final AuthenticatedHttpClient _authenticatedHttpClient;

  @override
  void initState() {
    super.initState();

    _authService = AuthService();
    _authenticatedHttpClient = AuthenticatedHttpClient(
      baseUrl: 'https://localhost:44315',
      authService: _authService,
    );
    _captureService = EmployeeHoursCaptureService(
      httpClient: _authenticatedHttpClient,
    );

    final timerService = Provider.of<TimerService>(context, listen: false);

    // Resume the timer if it was already active
    if (timerService.workedHoursNotifier.value > Duration.zero) {
      timerService.startTimer(resume: true);
    }
  }

  @override
  void dispose() {
    scannerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final timerService = Provider.of<TimerService>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('QR Code Scanner'),
      ),
      body: Column(
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: ValueListenableBuilder<Duration>(
              valueListenable: timerService.workedHoursNotifier,
              builder: (context, duration, child) {
                return TimerComponent(duration: duration);
              },
            ),
          ),
          Expanded(
            flex: 5,
            child: isScanning
                ? MobileScanner(
                    controller: scannerController,
                    onDetect: (capture) {
                      if (!isCooldown) {
                        final List<Barcode> barcodes = capture.barcodes;
                        for (final barcode in barcodes) {
                          final String? code = barcode.rawValue;
                          if (code != null) {
                            _handleQRCodeScanned(code);
                            break;
                          }
                        }
                      }
                    },
                  )
                : Center(
                    child: const Text('Scanner Stopped'),
                  ),
          ),
          Expanded(
            flex: 1,
            child: Center(
              child: isTimeCaptured
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'Time has been captured.',
                          style: TextStyle(fontSize: 18, color: Colors.green),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'Worked Time: ${_formatDuration(finalWorkDuration)}\nEmployee ID: ${employeeId ?? "Unknown"}',
                          style: const TextStyle(fontSize: 18, color: Colors.black),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: _resetScanner,
                          child: const Text('Start New Session'),
                        ),
                      ],
                    )
                  : const Text(
                      'Scan a code to start the timer',
                      style: TextStyle(fontSize: 18, color: Colors.white),
                    ),
            ),
          ),
        ],
      ),
    );
  }

  void _handleQRCodeScanned(String code) async {
    print('QR code scanned: $code');

    if (isTimeCaptured) {
      print('Time already captured, ignoring scan.');
      return;
    }

    if (isCooldown) {
      print('Cooldown active, ignoring scan.');
      return;
    }

    final isValidEmployee = await _validateEmployeeId(code);
    final timerService = Provider.of<TimerService>(context, listen: false);

    if (isValidEmployee) {
      setState(() {
        employeeId = code;
        if (timerService.workedHoursNotifier.value == Duration.zero) {
          // Start the timer and close scanner
          timerService.startTimer();
          Navigator.of(context).pop(); 
        } else {
          // Capture time on return scan
          _stopTimerAndSendData(code);
        }
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Invalid Employee ID: $code')),
      );
    }

    _startCooldown();
  }

  Future<bool> _validateEmployeeId(String scannedEmployeeId) async {
    try {
      final signedInEmployeeId = await _authService.getEmployeeID();
      return signedInEmployeeId.toString() == scannedEmployeeId;
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error validating Employee ID: $e')),
      );
      return false;
    }
  }

  void _stopTimerAndSendData(String employeeId) async {
    final timerService = Provider.of<TimerService>(context, listen: false);
    final workedHours = timerService.workedHoursNotifier.value;

    double totalHours = workedHours.inHours +
        (workedHours.inMinutes % 60) / 60 +
        (workedHours.inSeconds % 60) / 3600;
    if (totalHours < 1) totalHours = 1.0;
    finalWorkDuration = workedHours;

    _resetScanner();

    try {
      await _captureService.captureDailyHours(
        employeeId: employeeId,
        totalHours: totalHours,
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to capture time: $e')),
      );
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Timer stopped. Time captured.')),
    );

    setState(() {
      isScanning = false;
      isTimeCaptured = true;
      scannerController.stop();
    });
  }

  void _resetScanner() {
    final timerService = Provider.of<TimerService>(context, listen: false);
    setState(() {
      isScanning = true;
      isTimeCaptured = false;
      finalWorkDuration = Duration.zero;
      timerService.reset();
      scannerController.start();
    });
  }

  void _startCooldown() {
    setState(() {
      isCooldown = true;
    });

    Future.delayed(Duration(seconds: 5), () {
      setState(() {
        isCooldown = false;
      });
    });
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    String twoDigitMinutes = twoDigits(duration.inMinutes.remainder(60));
    String twoDigitSeconds = twoDigits(duration.inSeconds.remainder(60));
    return "${twoDigits(duration.inHours)}:$twoDigitMinutes:$twoDigitSeconds";
  }
}
