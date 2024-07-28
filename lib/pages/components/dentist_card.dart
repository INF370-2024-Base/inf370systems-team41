import 'package:flutter/material.dart';

class DentistCard extends StatelessWidget {
  final String name;
  final String contactDetail;
  final String address;

  DentistCard({
    required this.name,
    required this.contactDetail,
    required this.address,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(10.0),
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Row(
              children: <Widget>[
                const Icon(Icons.medical_services, size: 40),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    name,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 5),
            Text(
              'Contact Detail: $contactDetail',
              style: const TextStyle(fontSize: 12),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 5),
            Text(
              'Address: $address',
              style: const TextStyle(fontSize: 12),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 5),
            const Spacer(),
            const Row(
              mainAxisAlignment: MainAxisAlignment.end,
              // children: <Widget>[
              //   ElevatedButton(
              //     onPressed: () {},
              //     child: Text(
              //       'Edit',
              //       style: TextStyle(fontSize: 12),
              //     ),
              //     style: ElevatedButton.styleFrom(
              //       padding: EdgeInsets.symmetric(vertical: 8.0),
              //     ),
              //   ),
              //   SizedBox(width: 5),
              //   OutlinedButton(
              //     onPressed: () {},
              //     child: Text(
              //       'Delete',
              //       style: TextStyle(fontSize: 12),
              //     ),
              //     style: OutlinedButton.styleFrom(
              //       padding: EdgeInsets.symmetric(vertical: 8.0),
              //     ),
              //   ),
              // ],
            ),
          ],
        ),
      ),
    );
  }
}
