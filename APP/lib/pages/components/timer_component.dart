// import 'package:flutter/material.dart';

// class TimerComponent extends StatelessWidget {
//   final Duration duration;

//   TimerComponent({required this.duration});

//   @override
//   Widget build(BuildContext context) {
//     String formatTime(int time) {
//       return time.toString().padLeft(2, '0');
//     }

//     final hours = formatTime(duration.inHours);
//     final minutes = formatTime(duration.inMinutes.remainder(60));
//     final seconds = formatTime(duration.inSeconds.remainder(60));

//     return Container(
//       padding: const EdgeInsets.all(20),
//       decoration: BoxDecoration(
//         color: Colors.blueGrey,
//         borderRadius: BorderRadius.circular(15),
//         boxShadow: const [
//           BoxShadow(
//             color: Colors.black26,
//             blurRadius: 10,
//             offset: Offset(0, 4),
//           ),
//         ],
//       ),
//       child: Column(
//         mainAxisSize: MainAxisSize.min,
//         children: [
//           const Text(
//             'Work Time',
//             style: TextStyle(
//               fontSize: 24,
//               color: Colors.white,
//               fontWeight: FontWeight.bold,
//             ),
//           ),
//           const SizedBox(height: 10),
//           Text(
//             '$hours:$minutes:$seconds',
//             style: const TextStyle(
//               fontSize: 48,
//               color: Colors.white,
//               fontWeight: FontWeight.bold,
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }
