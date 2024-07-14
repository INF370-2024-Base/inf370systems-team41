import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class QRCodeScannerPage extends StatefulWidget {
  @override
  _QRCodeScannerPageState createState() => _QRCodeScannerPageState();
}

class _QRCodeScannerPageState extends State<QRCodeScannerPage> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  QRViewController? controller;
  Barcode? result;
  DateTime? startTime;
  bool isScanning = true;
  Duration workedHours = Duration.zero;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('QR Code Scanner'),
      ),
      body: Column(
        children: <Widget>[
          if (isScanning)
            Expanded(
              flex: 5,
              child: QRView(
                key: qrKey,
                onQRViewCreated: _onQRViewCreated,
              ),
            )
          else
            Expanded(
              flex: 5,
              child: Center(
                child: StreamBuilder(
                  stream: Stream.periodic(Duration(seconds: 1)),
                  builder: (context, snapshot) {
                    return Text(
                      'Work time: ${workedHours.inHours}:${workedHours.inMinutes.remainder(60)}:${workedHours.inSeconds.remainder(60)}',
                      style: TextStyle(fontSize: 24),
                    );
                  },
                ),
              ),
            ),
          Expanded(
            flex: 1,
            child: Center(
              child: (result != null)
                  ? Text('Data/Employee ID: ${result!.code}')
                  : const Text('Scan a code'),
            ),
          ),
          if (!isScanning && startTime != null)
            ElevatedButton(
              onPressed: _stopTimerAndCaptureHours,
              child: Text('Stop Timer and Capture Hours'),
            ),
        ],
      ),
    );
  }

  void _onQRViewCreated(QRViewController controller) {
    setState(() {
      this.controller = controller;
    });
    controller.scannedDataStream.listen((scanData) {
      print('Scanned Data: ${scanData.code}');
      setState(() {
        result = scanData;
      });
      if (result != null && isScanning) {
        _startTimer();
      }
    });
  }

  void _startTimer() {
    setState(() {
      startTime = DateTime.now();
      isScanning = false;
      controller?.dispose();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Timer started')),
    );
    _timer = Timer.periodic(Duration(seconds: 1), (Timer t) {
      setState(() {
        workedHours = DateTime.now().difference(startTime!);
      });
    });
  }

  void _stopTimerAndCaptureHours() {
    if (startTime != null) {
      final endTime = DateTime.now();
      workedHours = endTime.difference(startTime!);
      _captureDailyHours(result!.code!, workedHours.inHours + workedHours.inMinutes / 60);
      setState(() {
        isScanning = true;
        startTime = null;
        result = null;
      });
      _timer?.cancel();
    }
  }

  Future<void> _captureDailyHours(String employeeId, double hours) async {
    final now = DateTime.now();
    final dailyHours = {
      'workDate': now.toIso8601String(),
      'hours': hours,
    };

    try {
      final response = await http.post(
        Uri.parse('https://localhost:44315/api/Employee/capture-daily-hours/$employeeId'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(dailyHours),
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Daily hours captured successfully')),
        );
      } else {
        print('Error: ${response.statusCode} - ${response.body}');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to capture daily hours')),
        );
      }
    } catch (e) {
      print('Error: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('An error occurred while capturing daily hours')),
      );
    }
  }

  @override
  void dispose() {
    controller?.dispose();
    _timer?.cancel();
    super.dispose();
  }
}
