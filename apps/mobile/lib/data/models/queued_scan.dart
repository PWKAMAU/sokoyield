import 'package:isar_community/isar.dart';

part 'queued_scan.g.dart';

enum SyncStatus {
  pending,
  syncing,
  synced,
  failed,
}

@collection
class QueuedScan {
  Id id = Isar.autoIncrement;

  @Index(unique: true)
  late String scanId;

  late String farmerId;

  late String cropName;

  late double quantityKg;

  late double unitPriceKes;

  late double totalPriceKes;

  late String localImagePath;

  late DateTime timestamp;

  late String gpsPolygonJson;

  @enumerated
  late SyncStatus syncStatus;

  late int retryCount;

  String? aiGrade;

  String? serverCropId;

  String? failureReason;

  late DateTime createdAt;
}
