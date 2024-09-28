import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:video_player/video_player.dart';

class AboutPage extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('About us'),
      ),
      body: Container( 
        
        color: const Color(0xFF8B9AAD),
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              Image.asset('assets/logo.jpg', height: 150),
              SizedBox(height: 16.0),

              // Bubble styled container for about section
              _buildBubble(context, 'Welcome to BioPro', '''
                Bio Pro is a cutting-edge dental laboratory, established in 2012 by Mr. Taljaard. 
                We specialize in crafting high-quality dental appliances such as crowns, bridges, 
                false teeth, and orthodontic devices. Our mission is to provide dentists with 
                precision-crafted solutions to ensure the best care for their patients.
              '''),

              SizedBox(height: 10.0),

              _buildBubble(context, 'Our Vision', '''
                "From Paper to Precision: Transforming Tradition with Technology."
              '''),

              SizedBox(height: 10.0),

              _buildBubble(context, 'What We Do', '''
                At Bio Pro, we offer a comprehensive digital solution for managing the entire order 
                workflow in dental labs. Our system streamlines order capture, assignment tracking, 
                delivery logistics, and employee management—all through our seamless web and mobile platforms.
              '''),

              SizedBox(height: 10.0),

              _buildColumns(context, 'Our Key Features', [
                '- Order Capture & Management',
                '- Real-time Order Status & Delivery Tracking',
                '- Media File Management',
                '- Employee Hours Tracking',
                '- Advanced Reporting'
              ]),
               SizedBox(height: 10.0),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBubble(BuildContext context, String title, String content) {
    return Container(
      padding: EdgeInsets.all(16.0),
      margin: EdgeInsets.symmetric(vertical: 8.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 6.0,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center, 
        children: [
          Text(
            title,
            style: Theme.of(context).textTheme.titleLarge,
            textAlign: TextAlign.center, 
          ),
          SizedBox(height: 10.0),
          Text(
            content,
            style: TextStyle(fontSize: 16),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildColumns(BuildContext context, String title, List<String> features) {
    return Container(
      padding: EdgeInsets.all(16.0),
      margin: EdgeInsets.symmetric(vertical: 8.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 6.0,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center, 
        children: [
          Text(
            title,
            style: Theme.of(context).textTheme.titleLarge,
            textAlign: TextAlign.center, 
          ),
          SizedBox(height: 10.0),
          Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: features.map((feature) {
              return Text(
                feature,
                style: TextStyle(fontSize: 16),
                textAlign: TextAlign.center,
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}

