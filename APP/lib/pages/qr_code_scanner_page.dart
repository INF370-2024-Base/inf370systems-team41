import 'dart:async';
import 'package:biopromobileflutter/services/employee_hours_capture_service.dart';
import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'timer_component.dart';

class QRCodeScannerPage extends StatefulWidget {
  final ValueNotifier<Duration> workedHoursNotifier;

  QRCodeScannerPage({required this.workedHoursNotifier});

  @override
  _QRCodeScannerPageState createState() => _QRCodeScannerPageState();
}

class _QRCodeScannerPageState extends State<QRCodeScannerPage> with WidgetsBindingObserver {
  DateTime? startTime;
  Timer? _timer;
  bool isScanning = true;
  bool isTimeCaptured = false;
  Duration workedHours = Duration.zero;
  MobileScannerController scannerController = MobileScannerController();
  bool isCooldown = false;

  late final EmployeeHoursCaptureService _captureService;

  @override
  void initState() {
    super.initState();
    _captureService = EmployeeHoursCaptureService(baseUrl: 'https://localhost:44315');
    WidgetsBinding.instance.addObserver(this);
    if (widget.workedHoursNotifier.value > Duration.zero) {
      startTime = DateTime.now().subtract(widget.workedHoursNotifier.value);
      _startTimer();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _timer?.cancel();
    scannerController.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      if (isScanning) {
        scannerController.start();
      }
    } else if (state == AppLifecycleState.paused) {
      scannerController.stop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('QR Code Scanner'),
      ),
      body: Column(
        children: <Widget>[
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
                    child: TimerComponent(duration: widget.workedHoursNotifier.value),
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
                          'Worked Time: ${_formatDuration(workedHours)}',
                          style: const TextStyle(fontSize: 18, color: Colors.white),
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

    setState(() {
      if (startTime == null) {
        _startTimer();
      } else {
        _stopTimerAndSendData(code);
      }
    });

    _startCooldown();
  }

  void _startTimer() {
    print('Starting timer...');
    setState(() {
      startTime = DateTime.now();
      isTimeCaptured = false;
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Timer started. Scan again to stop.')),
      );
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

    Future.delayed(Duration(seconds: 3), () {
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
