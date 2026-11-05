import 'package:flutter/material.dart';
import '../../../../core/theme/sokoyield_theme.dart';

class StatusPill extends StatelessWidget {
  final String label;
  final String value;
  final Color highlightColor;

  const StatusPill({
    super.key,
    required this.label,
    required this.value,
    this.highlightColor = SokoYieldColors.cyberGreen,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: SokoYieldColors.surfaceNavy,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: highlightColor.withValues(alpha: 0.85),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: highlightColor.withValues(alpha: 0.25),
            blurRadius: 10,
            spreadRadius: 1,
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            '$label: ',
            style: const TextStyle(
              color: SokoYieldColors.textLight,
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              color: highlightColor,
              fontSize: 13,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }
}

class StatusPillsRow extends StatelessWidget {
  final String yieldPrediction;
  final String cropHealth;

  const StatusPillsRow({
    super.key,
    this.yieldPrediction = 'High',
    this.cropHealth = 'Checked',
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        StatusPill(
          label: 'Yield Prediction',
          value: yieldPrediction,
        ),
        const SizedBox(width: 12),
        StatusPill(
          label: 'Crop Health',
          value: cropHealth,
        ),
      ],
    );
  }
}
