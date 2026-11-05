import 'package:flutter/material.dart';
import '../../../../core/theme/sokoyield_theme.dart';

class CommodityPrice {
  final String emoji;
  final String name;
  final String priceFormatted;
  final double changePercentage;

  const CommodityPrice({
    required this.emoji,
    required this.name,
    required this.priceFormatted,
    required this.changePercentage,
  });

  bool get isPositive => changePercentage >= 0;
}

class MarketTicker extends StatelessWidget {
  final List<CommodityPrice> commodities;

  const MarketTicker({
    super.key,
    this.commodities = const [
      CommodityPrice(
        emoji: '🌽',
        name: 'Maize',
        priceFormatted: 'KES 3,200/bag',
        changePercentage: 2.1,
      ),
      CommodityPrice(
        emoji: '🥔',
        name: 'Potatoes',
        priceFormatted: 'KES 2,800/bag',
        changePercentage: -0.5,
      ),
      CommodityPrice(
        emoji: '🫘',
        name: 'Beans',
        priceFormatted: 'KES 6,400/bag',
        changePercentage: 1.8,
      ),
      CommodityPrice(
        emoji: '🌾',
        name: 'Wheat',
        priceFormatted: 'KES 4,100/bag',
        changePercentage: 0.8,
      ),
    ],
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16.0),
          child: Text(
            'Market price ticker',
            style: TextStyle(
              color: SokoYieldColors.textMuted,
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 52,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: commodities.length,
            separatorBuilder: (_, _) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              final item = commodities[index];
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: SokoYieldColors.surfaceNavy,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: SokoYieldColors.borderLine,
                    width: 1,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(item.emoji, style: const TextStyle(fontSize: 14)),
                    const SizedBox(width: 6),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.name,
                          style: const TextStyle(
                            color: SokoYieldColors.textLight,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Row(
                          children: [
                            Text(
                              item.priceFormatted,
                              style: const TextStyle(
                                color: SokoYieldColors.textMuted,
                                fontSize: 11,
                              ),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              item.isPositive
                                  ? '(+${item.changePercentage.toStringAsFixed(1)}%)'
                                  : '(${item.changePercentage.toStringAsFixed(1)}%)',
                              style: TextStyle(
                                color: item.isPositive
                                    ? SokoYieldColors.cyberGreen
                                    : SokoYieldColors.alertRed,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}
