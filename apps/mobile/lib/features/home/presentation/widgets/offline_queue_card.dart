import 'package:flutter/material.dart';
import '../../../../core/services/location_service.dart';
import '../../../../core/services/sync_service.dart';
import '../../../../core/theme/sokoyield_theme.dart';

class OfflineQueueCard extends StatelessWidget {
  final SyncState syncState;
  final LocationPoint currentLocation;
  final ValueChanged<bool> onToggleOffline;
  final VoidCallback onTriggerSync;

  const OfflineQueueCard({
    super.key,
    required this.syncState,
    required this.currentLocation,
    required this.onToggleOffline,
    required this.onTriggerSync,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: SokoYieldColors.surfaceNavy,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: SokoYieldColors.borderLine,
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: syncState.isOnline
                          ? SokoYieldColors.cyberGreen
                          : SokoYieldColors.alertRed,
                      boxShadow: [
                        BoxShadow(
                          color: syncState.isOnline
                              ? SokoYieldColors.greenGlow
                              : const Color(0x66E5262B),
                          blurRadius: 6,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    syncState.isOnline ? '4G Connected' : 'Offline Mode (Local Isar)',
                    style: TextStyle(
                      color: syncState.isOnline
                          ? SokoYieldColors.cyberGreen
                          : SokoYieldColors.alertRed,
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  const Text(
                    'Simulate 4G Loss:',
                    style: TextStyle(
                      color: SokoYieldColors.textMuted,
                      fontSize: 11,
                    ),
                  ),
                  const SizedBox(width: 6),
                  SizedBox(
                    height: 24,
                    child: Switch(
                      value: !syncState.isOnline,
                      activeThumbColor: SokoYieldColors.alertRed,
                      onChanged: (isOffline) => onToggleOffline(isOffline),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Divider(color: SokoYieldColors.borderLine, height: 1),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.location_on_outlined,
                          color: SokoYieldColors.electricGold,
                          size: 14,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          currentLocation.locationName,
                          style: const TextStyle(
                            color: SokoYieldColors.textLight,
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'GPS Polygon: [${currentLocation.latitude.toStringAsFixed(4)}, ${currentLocation.longitude.toStringAsFixed(4)}]',
                      style: const TextStyle(
                        color: SokoYieldColors.textMuted,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),
              if (syncState.pendingCount > 0)
                TextButton.icon(
                  onPressed: syncState.isOnline && !syncState.isSyncing
                      ? onTriggerSync
                      : null,
                  icon: syncState.isSyncing
                      ? const SizedBox(
                          width: 12,
                          height: 12,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: SokoYieldColors.electricGold,
                          ),
                        )
                      : const Icon(
                          Icons.sync,
                          size: 14,
                          color: SokoYieldColors.electricGold,
                        ),
                  label: Text(
                    syncState.isSyncing
                        ? 'Syncing...'
                        : 'Sync ${syncState.pendingCount} queued',
                    style: const TextStyle(
                      color: SokoYieldColors.electricGold,
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                )
              else
                const Row(
                  children: [
                    Icon(
                      Icons.check_circle_outline,
                      color: SokoYieldColors.cyberGreen,
                      size: 14,
                    ),
                    SizedBox(width: 4),
                    Text(
                      'All scans synced',
                      style: TextStyle(
                        color: SokoYieldColors.cyberGreen,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
            ],
          ),
        ],
      ),
    );
  }
}
