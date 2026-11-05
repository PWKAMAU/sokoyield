import 'package:isar_community/isar.dart';
import 'package:path_provider/path_provider.dart';
import '../models/queued_scan.dart';

class IsarService {
  static Isar? _instance;

  static Future<Isar> getInstance() async {
    if (_instance != null && _instance!.isOpen) {
      return _instance!;
    }

    final dir = await getApplicationDocumentsDirectory();
    _instance = await Isar.open(
      [QueuedScanSchema],
      directory: dir.path,
      name: 'sokoyield_offline_db',
    );

    return _instance!;
  }

  Future<void> enqueueScan(QueuedScan scan) async {
    final isar = await getInstance();
    await isar.writeTxn(() async {
      await isar.queuedScans.put(scan);
    });
  }

  Future<List<QueuedScan>> getAllScans() async {
    final isar = await getInstance();
    return isar.queuedScans.where().sortByCreatedAtDesc().findAll();
  }

  Future<List<QueuedScan>> getPendingScans() async {
    final isar = await getInstance();
    return isar.queuedScans
        .filter()
        .syncStatusEqualTo(SyncStatus.pending)
        .or()
        .syncStatusEqualTo(SyncStatus.failed)
        .sortByCreatedAt()
        .findAll();
  }

  Stream<List<QueuedScan>> watchAllScans() async* {
    final isar = await getInstance();
    yield* isar.queuedScans.where().sortByCreatedAtDesc().watch(fireImmediately: true);
  }

  Stream<int> watchPendingCount() async* {
    final isar = await getInstance();
    yield* isar.queuedScans
        .filter()
        .syncStatusEqualTo(SyncStatus.pending)
        .or()
        .syncStatusEqualTo(SyncStatus.failed)
        .watch(fireImmediately: true)
        .map((scans) => scans.length);
  }

  Future<void> updateScanStatus(
    int id,
    SyncStatus status, {
    String? serverCropId,
    String? aiGrade,
    String? failureReason,
  }) async {
    final isar = await getInstance();
    await isar.writeTxn(() async {
      final scan = await isar.queuedScans.get(id);
      if (scan != null) {
        scan.syncStatus = status;
        if (serverCropId != null) scan.serverCropId = serverCropId;
        if (aiGrade != null) scan.aiGrade = aiGrade;
        if (failureReason != null) scan.failureReason = failureReason;
        if (status == SyncStatus.failed) {
          scan.retryCount += 1;
        }
        await isar.queuedScans.put(scan);
      }
    });
  }

  Future<void> clearAll() async {
    final isar = await getInstance();
    await isar.writeTxn(() async {
      await isar.queuedScans.clear();
    });
  }
}
