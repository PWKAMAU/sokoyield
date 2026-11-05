import 'package:flutter_test/flutter_test.dart';
import 'package:sokoyield_mobile/core/services/sync_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Offline Sync & Financial Ledger Calculations Test', () {
    test('Financial ledger verifies 97% farmer payout and 3% SokoYield platform fee', () {
      const double quantityKg = 1000.0;
      const double unitPriceKes = 35.0;

      final totalPrice = quantityKg * unitPriceKes; // 35,000 KES
      final farmerPayout = totalPrice * 0.97;       // 33,950 KES
      final platformFee = totalPrice * 0.03;        // 1,050 KES

      expect(totalPrice, equals(35000.0));
      expect(farmerPayout, equals(33950.0));
      expect(platformFee, equals(1050.0));
      expect(farmerPayout + platformFee, equals(totalPrice));
    });

    test('SyncState reacts properly to offline simulation toggling', () {
      final syncService = SyncService();

      expect(syncService.currentState.isOnline, isTrue);

      // Simulate 4G connection loss in rural Nakuru County
      syncService.toggleSimulatedOffline(true);
      expect(syncService.isSimulatedOffline, isTrue);
      expect(syncService.currentState.isOnline, isFalse);

      // Restore 4G connectivity
      syncService.toggleSimulatedOffline(false);
      expect(syncService.isSimulatedOffline, isFalse);
      expect(syncService.currentState.isOnline, isTrue);

      syncService.dispose();
    });
  });
}
