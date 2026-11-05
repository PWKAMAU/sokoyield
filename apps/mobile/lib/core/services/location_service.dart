import 'dart:convert';
import 'dart:math';

/// Bounding box coordinates for Nakuru County, Kenya.
/// Reference: Kenya National Bureau of Statistics (KNBS) & Survey of Kenya.
class NakuruBoundingBox {
  static const double minLatitude = -0.6500; // Southern border (near Naivasha/Narok)
  static const double maxLatitude = 0.2800; // Northern border (near Baringo)
  static const double minLongitude = 35.8000; // Western border (near Mau Summit/Kericho)
  static const double maxLongitude = 36.5500; // Eastern border (near Aberdares/Nyandarua)

  // Nakuru County Agricultural Zone Center
  static const double centerLatitude = -0.3031;
  static const double centerLongitude = 36.0800;
}

class LocationPoint {
  final double latitude;
  final double longitude;
  final String locationName;

  const LocationPoint({
    required this.latitude,
    required this.longitude,
    required this.locationName,
  });

  bool get isInsideNakuruCounty =>
      latitude >= NakuruBoundingBox.minLatitude &&
      latitude <= NakuruBoundingBox.maxLatitude &&
      longitude >= NakuruBoundingBox.minLongitude &&
      longitude <= NakuruBoundingBox.maxLongitude;
}

class LocationService {
  // Common agricultural sub-counties in Nakuru County for realistic simulation
  static const List<LocationPoint> nakuruFarmingPlots = [
    LocationPoint(
      latitude: -0.3340,
      longitude: 35.9420,
      locationName: 'Njoro Agricultural Plot (Wheat & Maize)',
    ),
    LocationPoint(
      latitude: -0.1710,
      longitude: 35.8620,
      locationName: 'Rongai Mixed Farm (Maize & Beans)',
    ),
    LocationPoint(
      latitude: 0.0120,
      longitude: 36.2230,
      locationName: 'Subukia Valley Farm (Coffee & Potatoes)',
    ),
    LocationPoint(
      latitude: -0.1540,
      longitude: 36.1510,
      locationName: 'Bahati Highlands (Horticulture & Maize)',
    ),
  ];

  LocationPoint _currentLocation = nakuruFarmingPlots[0];

  LocationPoint get currentLocation => _currentLocation;

  void setLocation(LocationPoint point) {
    _currentLocation = point;
  }

  /// Generates a closed GeoJSON Polygon ring [[lng, lat], ...] around the farm location.
  /// GeoJSON requires coordinates in [longitude, latitude] order and closed (last == first).
  Map<String, dynamic> generateFarmPolygon({
    double? centerLat,
    double? centerLon,
    double radiusKm = 0.15,
  }) {
    final lat = centerLat ?? _currentLocation.latitude;
    final lon = centerLon ?? _currentLocation.longitude;

    // Approximate conversion: 1 deg lat ≈ 111 km; 1 deg lon ≈ 111 km * cos(lat)
    final latDelta = radiusKm / 111.0;
    final lonDelta = radiusKm / (111.0 * cos(lat * pi / 180.0));

    final ring = [
      [lon - lonDelta, lat - latDelta], // Bottom-Left
      [lon + lonDelta, lat - latDelta], // Bottom-Right
      [lon + lonDelta, lat + latDelta], // Top-Right
      [lon - lonDelta, lat + latDelta], // Top-Left
      [lon - lonDelta, lat - latDelta], // Closed ring
    ];

    return {
      'type': 'Polygon',
      'coordinates': [ring],
      'properties': {
        'county': 'Nakuru County',
        'country': 'Kenya',
        'locationName': _currentLocation.locationName,
        'simulated': true,
      },
    };
  }

  String generateFarmPolygonJson({double? centerLat, double? centerLon}) {
    return jsonEncode(generateFarmPolygon(centerLat: centerLat, centerLon: centerLon));
  }

  /// Returns active weather and pest alerts for Nakuru County.
  String getPestAndWeatherAlert() {
    if (_currentLocation.isInsideNakuruCounty) {
      return '🚨 PEST & WEATHER ALERT: Desert Locust warning in Nakuru County & heavy rain forecast.';
    }
    return 'Weather conditions normal for region.';
  }
}
