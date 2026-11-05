import 'package:flutter_test/flutter_test.dart';
import 'package:sokoyield_mobile/core/services/location_service.dart';

void main() {
  group('Nakuru County Geolocation & Bounding Box Test', () {
    late LocationService locationService;

    setUp(() {
      locationService = LocationService();
    });

    test('Verifies agricultural plots within Nakuru County bounding box', () {
      for (final plot in LocationService.nakuruFarmingPlots) {
        expect(
          plot.isInsideNakuruCounty,
          isTrue,
          reason: '${plot.locationName} should be inside Nakuru County bounding box',
        );
      }
    });

    test('Identifies coordinates outside Nakuru County', () {
      const mombasa = LocationPoint(
        latitude: -4.0435,
        longitude: 39.6682,
        locationName: 'Mombasa Coast',
      );
      expect(mombasa.isInsideNakuruCounty, isFalse);

      const nairobi = LocationPoint(
        latitude: -1.2921,
        longitude: 36.8219,
        locationName: 'Nairobi City',
      );
      expect(nairobi.isInsideNakuruCounty, isFalse);
    });

    test('Generates valid closed GeoJSON farm polygon ring', () {
      final polygon = locationService.generateFarmPolygon();

      expect(polygon['type'], equals('Polygon'));
      final coordinates = polygon['coordinates'] as List;
      expect(coordinates, isNotEmpty);

      final ring = coordinates.first as List;
      expect(ring.length, greaterThanOrEqualTo(5), reason: 'Linear ring must have at least 5 points');

      // First point must equal last point to form a closed polygon
      expect(ring.first[0], equals(ring.last[0]));
      expect(ring.first[1], equals(ring.last[1]));
    });

    test('Renders pest & weather warning for Nakuru County', () {
      final alert = locationService.getPestAndWeatherAlert();
      expect(alert, contains('Desert Locust warning in Nakuru County'));
    });
  });
}
