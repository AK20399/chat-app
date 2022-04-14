import 'package:flutter/material.dart';
import 'package:states_rebuilder/states_rebuilder.dart';
import 'package:vato/route/route.dart' as routes;

void main() async {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      navigatorKey: RM.navigate.navigatorKey,
      title: 'Mini Chat',
      onGenerateRoute: routes.onGenerateRoutes,
      debugShowCheckedModeBanner: false,
    );
  }
}
