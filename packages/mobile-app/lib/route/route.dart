import 'package:flutter/material.dart';
import 'package:states_rebuilder/states_rebuilder.dart';
import 'package:vato/screen/chat_init_screen/chat_init_screen.dart';
import 'package:vato/screen/chat_screen/chat_screen.dart';
import 'package:vato/screen/splash_screen/splash_screen.dart';

final Route<dynamic>? Function(RouteSettings settings) onGenerateRoutes =
    RM.navigate.onGenerateRoute(
  {
    '/': (_) => const SplashScreen(),
    '/chatInitScreen': (_) => const ChatInitScreen(),
    '/chatInitScreen/chatScreen': (_) => const ChatScreen(),
  },
);
