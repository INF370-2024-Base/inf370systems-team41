import 'dart:async';
import 'dart:convert';
import 'package:biopromobileflutter/services/auth_service.dart';
import 'package:http/http.dart' as http;
import 'package:biopromobileflutter/services/employee_hours_capture_service.dart';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'timer_component.dart';

class QRCodeScannerPage extends StatefulWidget {
  final ValueNotifier<Duration> workedHoursNotifier;
  late final AuthService _authService;
  late final AuthenticatedHttpClient _authenticatedHttpClient;
  QRCodeScannerPage({required this.workedHoursNotifier});

  @override
  _QRCodeScannerPageState createState() => _QRCodeScannerPageState();
}

class _QRCodeScannerPageState extends State<QRCodeScannerPage> {
  DateTime? startTime;
  Timer? _timer;
  bool isScanning = true;
  bool isTimeCaptured = false;
  String? employeeId;
  Duration workedHours = Duration.zero;
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
      baseUrl: 'https://localhost:44315', // Replace with your actual base URL
      authService: _authService,
    );
    _captureService = EmployeeHoursCaptureService(
      httpClient: _authenticatedHttpClient,
    );

    if (widget.workedHoursNotifier.value > Duration.zero) {
      startTime = DateTime.now().subtract(widget.workedHoursNotifier.value);
      _startTimer(resume: true);
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    scannerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('QR Code Scanner'),
      ),
      body: Column(
        children: <Widget>[
          if (startTime != null)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: ValueListenableBuilder<Duration>(
                valueListenable: widget.workedHoursNotifier,
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
                          'Worked Time: ${_formatDuration(workedHours)}\nEmployee ID: ${employeeId ?? "Unknown"}',
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

    if (isValidEmployee) {
      setState(() {
        employeeId = code; 
        if (startTime == null) {
          _startTimer();
        } else {
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
    final response = await http.get(
      Uri.parse('https://localhost:44315/api/Employee/GetAllEmployee'),
    );

    if (response.statusCode == 200) {
      final List<dynamic> employees = jsonDecode(response.body);
      print(employees);
      return employees.any((employee) => employee['employeeId'].toString() == scannedEmployeeId);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to validate Employee ID')),
      );
      return false;
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Error validating Employee ID: $e')),
    );
    return false;
  }
}


  void _startTimer({bool resume = false}) {
    print(resume ? 'Resuming timer...' : 'Starting timer...');

    if (!resume) {
      startTime = DateTime.now();
      widget.workedHoursNotifier.value = Duration.zero;
    }

    setState(() {
      isTimeCaptured = false;
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (Timer t) {
      final workedHours = DateTime.now().difference(startTime!);
      widget.workedHoursNotifier.value = workedHours;
    });
  }

  void _stopTimerAndSendData(String employeeId) async {
    print('Stopping timer...');
    final endTime = DateTime.now();
    workedHours = endTime.difference(startTime!);
    widget.workedHoursNotifier.value = workedHours;

    double totalHours = workedHours.inHours +
        (workedHours.inMinutes % 60) / 60 +
        (workedHours.inSeconds % 60) / 3600;

    if (totalHours < 1) {
      totalHours = 1.0;
    }
    _resetScanner();
    print('Total worked hours (rounded up): $totalHours');

    try {
      await _captureService.captureDailyHours(
        employeeId: employeeId,
        totalHours: totalHours,
      );
      
    } catch (e) {
      print('Error: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to capture time: $e')),
      );
    }

    WidgetsBinding.instance.addPostFrameCallback((_) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Timer stopped. Time captured.')),
      );
    });

    setState(() {
      isScanning = false;
      isTimeCaptured = true;
      startTime = null;
      scannerController.stop();
      _timer?.cancel();
    });
  }

  void _resetScanner() {
    setState(() {
      isScanning = true;
      isTimeCaptured = false;
      workedHours = Duration.zero;
      widget.workedHoursNotifier.value = Duration.zero;
      startTime = null;
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
