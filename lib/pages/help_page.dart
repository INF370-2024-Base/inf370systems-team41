import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

class HelpPage extends StatefulWidget {
  @override
  _HelpPageState createState() => _HelpPageState();
}

class _HelpPageState extends State<HelpPage> {
  late VideoPlayerController _controller;
  bool _isVideoLoading = true;
  bool _isPlaying = true;

  @override
  void initState() {
    super.initState();
    _controller = VideoPlayerController.asset('assets/HElp_Video.mp4')
      ..initialize().then((_) {
        setState(() {
          _isVideoLoading = false;
        });
        _controller.setLooping(true);
        _controller.play();
      });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _togglePlayPause() {
    setState(() {
      if (_controller.value.isPlaying) {
        _controller.pause();
      } else {
        _controller.play();
      }
      _isPlaying = !_isPlaying;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Help Page'),
      ),
      body: Container(
        color: const Color(0xFF8B9AAD),
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              // const Text(
              //   'Help Page',
              //   textAlign: TextAlign.center,
              //   style: TextStyle(
              //     fontSize: 24,
              //     fontWeight: FontWeight.bold,
              //   ),
              // ),
              const SizedBox(height: 20),
              const Text(
                'Here is a guide to help you navigate through the application.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18),
              ),
              const SizedBox(height: 20),
              _isVideoLoading
                  ? const Center(child: CircularProgressIndicator())
                  : Center(
                      child: Container(
                        width: 400,
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.black, width: 2),
                        ),
                        child: Column(
                          children: [
                            AspectRatio(
                              aspectRatio: _controller.value.aspectRatio,
                              child: VideoPlayer(_controller),
                            ),
                            VideoProgressSlider(controller: _controller),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                IconButton(
                                  icon: Icon(
                                    _isPlaying ? Icons.pause : Icons.play_arrow,
                                  ),
                                  onPressed: _togglePlayPause,
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
            ],
          ),
        ),
      ),
    );
  }
}

class VideoProgressSlider extends StatefulWidget {
  final VideoPlayerController controller;

  VideoProgressSlider({required this.controller});

  @override
  _VideoProgressSliderState createState() => _VideoProgressSliderState();
}

class _VideoProgressSliderState extends State<VideoProgressSlider> {
  void listener() {
    if (!mounted) return;
    setState(() {});
  }

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(listener);
  }

  @override
  void dispose() {
    widget.controller.removeListener(listener);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Slider(
          value: widget.controller.value.position.inSeconds.toDouble(),
          min: 0,
          max: widget.controller.value.duration.inSeconds.toDouble(),
          onChanged: (value) {
            widget.controller.seekTo(Duration(seconds: value.toInt()));
          },
        ),
      ],
    );
  }
}
