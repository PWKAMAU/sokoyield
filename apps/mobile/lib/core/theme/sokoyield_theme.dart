import 'package:flutter/material.dart';

/// SokoYield "Cyber-Agronomy" Design System
/// Matches the reference prototype:
/// - Midnight Navy background: #0A1124
/// - Electric Yield Gold: #F2E30B
/// - Cyber Green: #39FF88
/// - Alert Red: #E5262B
class SokoYieldColors {
  static const Color midnightNavy = Color(0xFF0A1124);
  static const Color surfaceNavy = Color(0xFF111A33);
  static const Color surfaceElevated = Color(0xFF162244);
  static const Color borderLine = Color(0xFF1F2A48);

  static const Color electricGold = Color(0xFFF2E30B);
  static const Color electricGoldDim = Color(0xFFC7BA08);
  static const Color goldGlow = Color(0x66F2E30B);

  static const Color cyberGreen = Color(0xFF39FF88);
  static const Color cyberGreenDim = Color(0xFF1E8C4A);
  static const Color greenGlow = Color(0x4D39FF88);

  static const Color alertRed = Color(0xFFE5262B);
  static const Color alertRedBg = Color(0xFFB31B1F);

  static const Color textLight = Color(0xFFE6EBF5);
  static const Color textMuted = Color(0xFF8A95B0);
  static const Color textDark = Color(0xFF0A0F1D);
}

class SokoYieldTheme {
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: SokoYieldColors.midnightNavy,
      canvasColor: SokoYieldColors.midnightNavy,
      cardColor: SokoYieldColors.surfaceNavy,
      colorScheme: const ColorScheme.dark(
        primary: SokoYieldColors.electricGold,
        secondary: SokoYieldColors.cyberGreen,
        surface: SokoYieldColors.surfaceNavy,
        error: SokoYieldColors.alertRed,
        onPrimary: SokoYieldColors.textDark,
        onSecondary: SokoYieldColors.textDark,
        onSurface: SokoYieldColors.textLight,
      ),
      fontFamily: 'Roboto',
      appBarTheme: const AppBarTheme(
        backgroundColor: SokoYieldColors.midnightNavy,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: SokoYieldColors.midnightNavy,
        selectedItemColor: SokoYieldColors.electricGold,
        unselectedItemColor: SokoYieldColors.textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 10,
      ),
    );
  }
}
