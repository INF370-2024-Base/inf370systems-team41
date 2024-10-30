import 'dart:async';
import 'package:flutter/material.dart';

class TimerService extends ChangeNotifier {
  DateTime? _startTime;
  Timer? _timer;
  Duration _workedHours = Duration.zero;

  ValueNotifier<Duration> workedHoursNotifier = ValueNotifier(Duration.zero);

  void startTimer({bool resume = false}) {
    if (!resume) {
      _startTime = DateTime.now();
      _workedHours = Duration.zero;
      workedHoursNotifier.value = Duration.zero;
    } else if (_startTime == null) {
      _startTime = DateTime.now().subtract(workedHoursNotifier.value);
    }

    _timer?.cancel(); // Ensure any existing timer is canceled before starting a new one
    _timer = Timer.periodic(const Duration(seconds: 1), (Timer t) {
      _workedHours = DateTime.now().difference(_startTime!);
      workedHoursNotifier.value = _workedHours;
    });
  }

  void stopTimer() {
    _timer?.cancel();
    _startTime = null;
  }

  void reset() {
    stopTimer();
    _workedHours = Duration.zero;
    workedHoursNotifier.value = Duration.zero;
    notifyListeners();
  }
}
