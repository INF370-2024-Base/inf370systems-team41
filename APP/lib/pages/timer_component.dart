import 'package:flutter/material.dart';

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
      padding: const EdgeInsets.symmetric(vertical: 3, horizontal: 15), 
      decoration: BoxDecoration(
        color: Colors.blueAccent,
        borderRadius: BorderRadius.circular(10),
        boxShadow: const [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 8,
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
              fontSize: 14, 
              color: Colors.white,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 3), 
          Text(
            '$hours:$minutes:$seconds',
            style: const TextStyle(
              fontSize: 24, 
              color: Colors.white,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}
