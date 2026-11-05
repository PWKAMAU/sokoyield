import 'package:flutter_test/flutter_test.dart';
import 'package:sokoyield_mobile/main.dart';

void main() {
  testWidgets('FarmerHomeScreen Cyber-Agronomy UI smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const SokoYieldApp());
    await tester.pump();

    // 1. Verify Alert Banner
    expect(find.textContaining('Desert Locust warning in Nakuru County'), findsOneWidget);

    // 2. Verify SokoYield Logo
    expect(find.text('SokoYield'), findsOneWidget);

    // 3. Verify Escrow Wallet Card
    expect(find.text('Escrow Wallet'), findsWidgets);
    expect(find.text('KES 45,280.00'), findsOneWidget);

    // 4. Verify Market Price Ticker
    expect(find.text('Market price ticker'), findsOneWidget);
    expect(find.text('Maize'), findsOneWidget);
    expect(find.text('Potatoes'), findsOneWidget);
    expect(find.text('Beans'), findsOneWidget);

    // 5. Verify Central Glowing Scanner Button
    expect(find.text('Scan Crop'), findsOneWidget);
    expect(find.text('AI'), findsOneWidget);

    // 6. Verify Verification Status Pills
    expect(find.textContaining('Yield Prediction:'), findsOneWidget);
    expect(find.text('High'), findsOneWidget);
    expect(find.textContaining('Crop Health:'), findsOneWidget);
    expect(find.text('Checked'), findsOneWidget);

    // 7. Verify Bottom Navigation items
    expect(find.text('Home'), findsOneWidget);
    expect(find.text('Marketplace'), findsOneWidget);
    expect(find.text('Insights'), findsOneWidget);
  });
}
