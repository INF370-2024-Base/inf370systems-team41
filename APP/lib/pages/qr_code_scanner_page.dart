import 'dart:async';
import 'package:biopromobileflutter/pages/components/timer_component.dart';
import 'package:flutter/material.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';

class QRCodeScannerPage extends StatefulWidget {
  final ValueNotifier<Duration> workedHoursNotifier;

  QRCodeScannerPage({required this.workedHoursNotifier});

  @override
  _QRCodeScannerPageState createState() => _QRCodeScannerPageState();
}

class _QRCodeScannerPageState extends State<QRCodeScannerPage> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  QRViewController? controller;
  Barcode? result;
  DateTime? startTime;
  bool isScanning = true;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    if (widget.workedHoursNotifier.value > Duration.zero) {
      isScanning = false; // Continue from previous session
      startTime = DateTime.now().subtract(widget.workedHoursNotifier.value);
      _startTimer();
    }
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('QR Code Scanner'),
      ),
      body: Container(
        color: const Color(0xFF8B9AAD),
        padding: EdgeInsets.all(20),
        child: Column(
          children: <Widget>[
            Expanded(
              flex: 5,
              child: isScanning
                  ? QRView(
                      key: qrKey,
                      onQRViewCreated: _onQRViewCreated,
                    )
                  : Center(
                      child: TimerComponent(duration: widget.workedHoursNotifier.value),
                    ),
            ),
            Expanded(
              flex: 1,
              child: Center(
                child: result != null
                    ? Text(
                        'Data/Employee ID: ${result!.code}',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                      )
                    : const Text('Scan a code', style: TextStyle(fontSize: 18, color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _onQRViewCreated(QRViewController controller) {
    setState(() {
      this.controller = controller;
    });
    controller.scannedDataStream.listen((scanData) {
      setState(() {
        result = scanData;
      });
      if (result != null && isScanning) {
        _startTimer();
      } else if (result != null && !isScanning) {
        _stopTimer();
      }
    });
  }

  void _startTimer() {
    setState(() {
      startTime = DateTime.now();
      isScanning = false;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Timer started')),
    );
    _timer = Timer.periodic(const Duration(seconds: 1), (Timer t) {
      final workedHours = DateTime.now().difference(startTime!);
      widget.workedHoursNotifier.value = workedHours;
    });
  }

  void _stopTimer() {
    final endTime = DateTime.now();
    final workedHours = endTime.difference(startTime!);
    widget.workedHoursNotifier.value = workedHours;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Timer stopped')),
    );
    setState(() {
      isScanning = true;
      startTime = null;
      result = null;
    });
  }
}
