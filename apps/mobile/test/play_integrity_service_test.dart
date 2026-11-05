import 'package:flutter_test/flutter_test.dart';
import 'package:sokoyield_mobile/core/services/play_integrity_service.dart';

void main() {
  group('Play Integrity Service Test (Android 16 / API 36 Security)', () {
    late PlayIntegrityService service;

    setUp(() {
      service = PlayIntegrityService();
    });

    test('generates valid SHA-256 client nonce from cropId and timestamp', () {
      final now = DateTime(2026, 11, 5, 12, 0, 0);
      final nonce1 = service.generateNonce('crop-123', now);
      final nonce2 = service.generateNonce('crop-123', now);
      final nonce3 = service.generateNonce('crop-456', now);

      expect(nonce1, equals(nonce2));
      expect(nonce1, isNot(equals(nonce3)));
      expect(nonce1.length, equals(64)); // SHA-256 hex length
    });

    test('obtains verified device verdict with integrity token', () async {
      final verdict = await service.requestIntegrityToken('crop-123');

      expect(verdict.isVerifiedDevice, isTrue);
      expect(verdict.integrityToken, startsWith('sokoyield_test_token_'));
      expect(verdict.nonce.length, equals(64));
    });
  });
}
