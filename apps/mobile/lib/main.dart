import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'core/theme/sokoyield_theme.dart';
import 'features/home/presentation/screens/farmer_home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Dark navigation bar and status bar to match Midnight Navy Cyber-Agronomy theme
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: SokoYieldColors.midnightNavy,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  runApp(const SokoYieldApp());
}

class SokoYieldApp extends StatelessWidget {
  const SokoYieldApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SokoYield',
      debugShowCheckedModeBanner: false,
      theme: SokoYieldTheme.darkTheme,
      home: const FarmerHomeScreen(),
    );
  }
}
