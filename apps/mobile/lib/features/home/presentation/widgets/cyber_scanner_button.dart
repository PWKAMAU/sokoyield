import 'package:flutter/material.dart';
import '../../../../core/theme/sokoyield_theme.dart';

class CyberScannerButton extends StatefulWidget {
  final VoidCallback onTap;
  final bool isScanning;

  const CyberScannerButton({
    super.key,
    required this.onTap,
    this.isScanning = false,
  });

  @override
  State<CyberScannerButton> createState() => _CyberScannerButtonState();
}

class _CyberScannerButtonState extends State<CyberScannerButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _glowAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1800),
    )..repeat(reverse: true);

    _glowAnimation = Tween<double>(begin: 18.0, end: 36.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _glowAnimation,
      builder: (context, child) {
        return GestureDetector(
          onTap: widget.onTap,
          child: Container(
            width: 220,
            height: 220,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: SokoYieldColors.midnightNavy,
              boxShadow: [
                BoxShadow(
                  color: SokoYieldColors.goldGlow.withValues(alpha: 0.4),
                  blurRadius: _glowAnimation.value + 12,
                  spreadRadius: 4,
                ),
                BoxShadow(
                  color: SokoYieldColors.electricGold.withValues(alpha: 0.35),
                  blurRadius: _glowAnimation.value,
                  spreadRadius: 2,
                ),
              ],
              border: Border.all(
                color: SokoYieldColors.electricGold,
                width: 3.5,
              ),
            ),
            child: Center(
              child: Container(
                width: 184,
                height: 184,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: SokoYieldColors.surfaceNavy,
                  border: Border.all(
                    color: SokoYieldColors.electricGold.withValues(alpha: 0.55),
                    width: 2,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Aperture / Camera Icon
                    const Icon(
                      Icons.camera_rounded,
                      color: SokoYieldColors.electricGold,
                      size: 46,
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'Scan Crop',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 3),
                    const Text(
                      'AI',
                      style: TextStyle(
                        color: SokoYieldColors.electricGold,
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
