import 'dart:async';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_scanner/mobile_scanner.dart';
import 'dart:convert';

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

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    if (widget.workedHoursNotifier.value > Duration.zero) {
      startTime = DateTime.now().subtract(widget.workedHoursNotifier.value);
      _startTimer();
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
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

    // Convert workedHours to decimal hours
    double totalHours = workedHours.inHours +
        (workedHours.inMinutes % 60) / 60 +
        (workedHours.inSeconds % 60) / 3600;
    
    // Round up to the nearest hour if less than 1 hour
    if (totalHours < 1) {
        totalHours = 1.0;
    }

    print('Total worked hours (rounded up): $totalHours');

    // Send the data to the backend
    await _sendTimeToBackend(employeeId, totalHours);

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

Future<void> _sendTimeToBackend(String employeeId, double totalHours) async {
    print('Sending worked hours to backend: $totalHours hours');
    final String apiUrl =
        'https://localhost:44315/api/Employee/capture-daily-hours/$employeeId';

    final Map<String, dynamic> data = {
      "employeeDailyHoursId": 0,
      "employeeId": int.parse(employeeId),
      "workDate": DateTime.now().toIso8601String(),
      "hours": totalHours, // Sending as double
    };

    print('Sending the following data to $apiUrl:');
    print(jsonEncode(data));

    try {
      final response = await http.post(
        Uri.parse(apiUrl),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(data),
      );

      if (response.statusCode == 200) {
        print('Time successfully captured.');
      } else {
        print('Failed to capture time: ${response.body}');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to capture time: ${response.body}')),
        );
      }
    } catch (e) {
      print('Error: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('An error occurred: $e')),
      );
    }
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

class TimerComponent extends StatelessWidget {
  final Duration duration;

  TimerComponent({required this.duration});

  @override
  Widget build(BuildContext context) {
    String formatTime(int time) {
      return time.toString().padLeft(2, '0');
    }

    final hours = formatTime(duration.inHours);
    final minutes = formatTime(duration.inMinutes.remainder(60));
    final seconds = formatTime(duration.inSeconds.remainder(60));

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.blueGrey,
        borderRadius: BorderRadius.circular(15),
        boxShadow: const [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Work Time',
            style: TextStyle(
              fontSize: 24,
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            '$hours:$minutes:$seconds',
            style: const TextStyle(
              fontSize: 48,
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
