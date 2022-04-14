import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:states_rebuilder/scr/state_management/state_management.dart';
import 'package:vato/constants/color_constants.dart';
import 'package:vato/constants/icon_constants.dart';
import 'package:vato/screen/chat_screen/store/socket_connection.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initSocketConnection();
    socketConnection.state.connectionState.stream
        .listen(_listenSocketConnectionState);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: ColorConstants.lightGrey,
      body: Container(
        color: ColorConstants.lightGrey,
        padding: const EdgeInsets.all(32.0),
        child: Center(
          child: Stack(
            alignment: Alignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.only(right: 28.0, top: 32.0),
                child: SvgPicture.asset(
                  IconConstants.messaging,
                  height: 240.0,
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  const Padding(
                    padding: EdgeInsets.only(bottom: 32.0),
                    child: CircularProgressIndicator(
                      strokeWidth: 2.0,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        ColorConstants.purple,
                      ),
                    ),
                  ),
                  Text(
                    "Mini Chat",
                    textAlign: TextAlign.center,
                    style: GoogleFonts.raleway(
                      fontSize: 32.0,
                      color: ColorConstants.black,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _initSocketConnection() async {
    socketConnection.state.initSocketConnection();
  }

  _listenSocketConnectionState(SocketConnectionState state) {
    if (state == SocketConnectionState.connected) {
      _navigateToChatInitScreen();
    }
  }

  _navigateToChatInitScreen() {
    Future.delayed(const Duration(seconds: 2)).then(
      (_) {
        RM.navigate.toReplacementNamed('chatInitScreen/');
      },
    );
  }
}
