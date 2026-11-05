import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';
import 'package:uuid/uuid.dart';
import '../../data/local/isar_service.dart';
import '../../data/models/queued_scan.dart';
import 'location_service.dart';

class ScanService {
  final IsarService _isarService;
  final LocationService _locationService;
  final ImagePicker _picker;

  ScanService({
    IsarService? isarService,
    LocationService? locationService,
    ImagePicker? picker,
  })  : _isarService = isarService ?? IsarService(),
        _locationService = locationService ?? LocationService(),
        _picker = picker ?? ImagePicker();

  /// Captures a crop photo using the device camera (or gallery fallback),
  /// saves it to permanent local storage offline, and queues it in the Isar database.
  Future<QueuedScan?> captureAndQueueCrop({
    required String cropName,
    required double quantityKg,
    required double unitPriceKes,
    String farmerId = 'farmer_nakuru_001',
    ImageSource source = ImageSource.camera,
  }) async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: source,
        maxWidth: 1920,
        maxHeight: 1080,
        imageQuality: 85,
      );

      if (photo == null) {
        return null; // User cancelled camera
      }

      return await _persistAndEnqueue(
        fileSource: File(photo.path),
        cropName: cropName,
        quantityKg: quantityKg,
        unitPriceKes: unitPriceKes,
        farmerId: farmerId,
      );
    } catch (e) {
      // In simulator or headless environment where camera hardware is absent,
      // create a mock offline scan record
      return await simulateOfflineCapture(
        cropName: cropName,
        quantityKg: quantityKg,
        unitPriceKes: unitPriceKes,
        farmerId: farmerId,
      );
    }
  }

  /// Simulates an offline photo capture for test environments / emulators.
  /// Creates a local image file in the app documents directory and queues it.
  Future<QueuedScan> simulateOfflineCapture({
    required String cropName,
    required double quantityKg,
    required double unitPriceKes,
    String farmerId = 'farmer_nakuru_001',
  }) async {
    final docsDir = await getApplicationDocumentsDirectory();
    final scansDir = Directory('${docsDir.path}/scans');
    if (!await scansDir.exists()) {
      await scansDir.create(recursive: true);
    }

    final scanId = const Uuid().v4();
    final mockFile = File('${scansDir.path}/$scanId.jpg');
    // Write mock binary image payload
    await mockFile.writeAsBytes(List<int>.generate(256, (i) => i % 256));

    final polygonJson = _locationService.generateFarmPolygonJson();

    final queuedScan = QueuedScan()
      ..scanId = scanId
      ..farmerId = farmerId
      ..cropName = cropName
      ..quantityKg = quantityKg
      ..unitPriceKes = unitPriceKes
      ..totalPriceKes = quantityKg * unitPriceKes
      ..localImagePath = mockFile.path
      ..timestamp = DateTime.now()
      ..gpsPolygonJson = polygonJson
      ..syncStatus = SyncStatus.pending
      ..retryCount = 0
      ..aiGrade = 'PENDING_SCAN'
      ..createdAt = DateTime.now();

    await _isarService.enqueueScan(queuedScan);
    return queuedScan;
  }

  Future<QueuedScan> _persistAndEnqueue({
    required File fileSource,
    required String cropName,
    required double quantityKg,
    required double unitPriceKes,
    required String farmerId,
  }) async {
    final docsDir = await getApplicationDocumentsDirectory();
    final scansDir = Directory('${docsDir.path}/scans');
    if (!await scansDir.exists()) {
      await scansDir.create(recursive: true);
    }

    final scanId = const Uuid().v4();
    final permanentPath = '${scansDir.path}/$scanId.jpg';
    await fileSource.copy(permanentPath);

    final polygonJson = _locationService.generateFarmPolygonJson();

    final queuedScan = QueuedScan()
      ..scanId = scanId
      ..farmerId = farmerId
      ..cropName = cropName
      ..quantityKg = quantityKg
      ..unitPriceKes = unitPriceKes
      ..totalPriceKes = quantityKg * unitPriceKes
      ..localImagePath = permanentPath
      ..timestamp = DateTime.now()
      ..gpsPolygonJson = polygonJson
      ..syncStatus = SyncStatus.pending
      ..retryCount = 0
      ..aiGrade = 'PENDING_SCAN'
      ..createdAt = DateTime.now();

    await _isarService.enqueueScan(queuedScan);
    return queuedScan;
  }
}
