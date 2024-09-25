import 'package:biopromobileflutter/services/auth_service.dart';
import 'package:biopromobileflutter/services/dentist_service.dart';
import 'package:flutter/material.dart';
import 'components/dentist_card.dart';

class DentistsPage extends StatefulWidget {
  @override
  _DentistsPageState createState() => _DentistsPageState();
}

class _DentistsPageState extends State<DentistsPage> {
  late Future<List<dynamic>> futureDentists;
  late DentistService dentistService;

  @override
  void initState() {
    super.initState();
    
    // Initialize AuthService and DentistService
    final authService = AuthService(); // Initialize your AuthService here
    dentistService = DentistService(
      baseUrl: 'https://localhost:44315/api/Dentist',
      authService: authService,
    );
    
    // Fetch dentists
    futureDentists = dentistService.fetchDentists(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dentists'),
      ),
      body: Container(
        color: const Color(0xFF8B9AAD),
        child: FutureBuilder<List<dynamic>>(
          future: futureDentists,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return const Center(child: Text('No dentists found'));
            } else {
              final dentists = snapshot.data!;
              return Scrollbar(
                child: GridView.builder(
                  padding: const EdgeInsets.symmetric(vertical: 20.0, horizontal: 10.0),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 10.0,
                    mainAxisSpacing: 10.0,
                    childAspectRatio: 3 / 3,
                  ),
                  itemCount: dentists.length,
                  itemBuilder: (context, index) {
                    final dentist = dentists[index];
                    return Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15.0),
                      ),
                      elevation: 5,
                      margin: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 5.0),
                      child: Padding(
                        padding: const EdgeInsets.all(15.0),
                        child: DentistCard(
                          name: '${dentist['firstName']} ${dentist['lastName']}',
                          contactDetail: dentist['contactDetail'] ?? '',
                          address: dentist['address'] ?? '',
                        ),
                      ),
                    );
                  },
                ),
              );
            }
          },
        ),
      ),
    );
  }
}
