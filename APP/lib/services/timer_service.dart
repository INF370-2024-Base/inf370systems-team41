import 'dart:async';
import 'package:flutter/material.dart';

class TimerService extends ChangeNotifier {
  final ValueNotifier<Duration> workedHoursNotifier = ValueNotifier(Duration.zero);
  Timer? _timer;
  DateTime? startTime;

  void startTimer({bool resume = false}) {
    if (resume && startTime != null) {
      workedHoursNotifier.value = DateTime.now().difference(startTime!);
    } else {
      startTime = DateTime.now();
    }

    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      workedHoursNotifier.value = DateTime.now().difference(startTime!);
    });
  }

  void stopTimer() {
    _timer?.cancel();
  }

  void resetTimer() {
    _timer?.cancel();
    workedHoursNotifier.value = Duration.zero;
    startTime = null;
  }
}
