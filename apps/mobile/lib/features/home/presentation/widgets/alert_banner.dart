import 'package:flutter/material.dart';
import '../../../../core/theme/sokoyield_theme.dart';

class AlertBanner extends StatelessWidget {
  final String alertMessage;

  const AlertBanner({
    super.key,
    required this.alertMessage,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: const BoxDecoration(
        color: SokoYieldColors.alertRed,
        boxShadow: [
          BoxShadow(
            color: Color(0x55E5262B),
            blurRadius: 8,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Icon(
            Icons.warning_amber_rounded,
            color: Colors.white,
            size: 20,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              alertMessage,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.2,
                height: 1.3,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
