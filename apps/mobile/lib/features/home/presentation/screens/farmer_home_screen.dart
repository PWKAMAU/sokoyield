import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/services/location_service.dart';
import '../../../../core/services/scan_service.dart';
import '../../../../core/services/sync_service.dart';
import '../../../../core/theme/sokoyield_theme.dart';
import '../widgets/alert_banner.dart';
import '../widgets/cyber_scanner_button.dart';
import '../widgets/market_ticker.dart';
import '../widgets/offline_queue_card.dart';
import '../widgets/status_pills.dart';

class FarmerHomeScreen extends StatefulWidget {
  const FarmerHomeScreen({super.key});

  @override
  State<FarmerHomeScreen> createState() => _FarmerHomeScreenState();
}

class _FarmerHomeScreenState extends State<FarmerHomeScreen> {
  final LocationService _locationService = LocationService();
  late final ScanService _scanService;
  late final SyncService _syncService;

  int _currentTabIndex = 0;
  bool _isCapturing = false;
  final double _escrowWalletBalance = 45280.00;

  @override
  void initState() {
    super.initState();
    _scanService = ScanService(locationService: _locationService);
    _syncService = SyncService();
  }

  @override
  void dispose() {
    _syncService.dispose();
    super.dispose();
  }

  void _onScanTapped() {
    _showCropCaptureSheet();
  }

  void _showCropCaptureSheet() {
    String selectedCrop = 'Maize';
    double quantityKg = 1000.0;
    double unitPriceKes = 35.0;

    showModalBottomSheet(
      context: context,
      backgroundColor: SokoYieldColors.surfaceNavy,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        side: BorderSide(color: SokoYieldColors.borderLine),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setSheetState) {
            final totalPrice = quantityKg * unitPriceKes;
            final farmerPayout = totalPrice * 0.97;
            final platformFee = totalPrice * 0.03;

            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Harvest Crop Scanner (AI)',
                        style: TextStyle(
                          color: SokoYieldColors.textLight,
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: SokoYieldColors.textMuted),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'GPS Farm Plot: ${_locationService.currentLocation.locationName}',
                    style: const TextStyle(
                      color: SokoYieldColors.electricGold,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Crop Selection
                  const Text(
                    'Select Harvested Commodity:',
                    style: TextStyle(color: SokoYieldColors.textMuted, fontSize: 13),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: ['Maize', 'Potatoes', 'Beans', 'Wheat'].map((crop) {
                      final isSelected = selectedCrop == crop;
                      return ChoiceChip(
                        label: Text(crop),
                        selected: isSelected,
                        selectedColor: SokoYieldColors.electricGold,
                        backgroundColor: SokoYieldColors.midnightNavy,
                        labelStyle: TextStyle(
                          color: isSelected
                              ? SokoYieldColors.textDark
                              : SokoYieldColors.textLight,
                          fontWeight: FontWeight.w600,
                        ),
                        onSelected: (val) {
                          if (val) setSheetState(() => selectedCrop = crop);
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),

                  // Quantity and Price
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Quantity (kg):', style: TextStyle(color: SokoYieldColors.textMuted, fontSize: 12)),
                            const SizedBox(height: 4),
                            TextFormField(
                              initialValue: quantityKg.toStringAsFixed(0),
                              keyboardType: TextInputType.number,
                              style: const TextStyle(color: Colors.white),
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: SokoYieldColors.midnightNavy,
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                              ),
                              onChanged: (val) {
                                final n = double.tryParse(val);
                                if (n != null) setSheetState(() => quantityKg = n);
                              },
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Price per kg (KES):', style: TextStyle(color: SokoYieldColors.textMuted, fontSize: 12)),
                            const SizedBox(height: 4),
                            TextFormField(
                              initialValue: unitPriceKes.toStringAsFixed(0),
                              keyboardType: TextInputType.number,
                              style: const TextStyle(color: Colors.white),
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: SokoYieldColors.midnightNavy,
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                              ),
                              onChanged: (val) {
                                final p = double.tryParse(val);
                                if (p != null) setSheetState(() => unitPriceKes = p);
                              },
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Escrow Split preview
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: SokoYieldColors.midnightNavy,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: SokoYieldColors.borderLine),
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Total Escrow Listing:', style: TextStyle(color: SokoYieldColors.textMuted, fontSize: 12)),
                            Text('KES ${totalPrice.toStringAsFixed(2)}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Farmer Payout (97%):', style: TextStyle(color: SokoYieldColors.cyberGreen, fontSize: 12)),
                            Text('KES ${farmerPayout.toStringAsFixed(2)}', style: const TextStyle(color: SokoYieldColors.cyberGreen, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text('Platform Escrow Fee (3%):', style: TextStyle(color: SokoYieldColors.textMuted, fontSize: 11)),
                            Text('KES ${platformFee.toStringAsFixed(2)}', style: const TextStyle(color: SokoYieldColors.textMuted, fontSize: 11)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),

                  // Camera Capture & Offline Queue Button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: SokoYieldColors.electricGold,
                        foregroundColor: SokoYieldColors.textDark,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      icon: const Icon(Icons.camera_alt_rounded),
                      label: const Text(
                        'Take Photo & Queue for AI',
                        style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                      ),
                      onPressed: () async {
                        final messenger = ScaffoldMessenger.of(context);
                        Navigator.pop(context);
                        setState(() => _isCapturing = true);

                        final queuedScan = await _scanService.simulateOfflineCapture(
                          cropName: selectedCrop,
                          quantityKg: quantityKg,
                          unitPriceKes: unitPriceKes,
                        );

                        if (mounted) {
                          setState(() => _isCapturing = false);
                        }

                        messenger.showSnackBar(
                          SnackBar(
                            backgroundColor: SokoYieldColors.surfaceElevated,
                            content: Row(
                              children: [
                                const Icon(Icons.cloud_queue_rounded, color: SokoYieldColors.cyberGreen),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(
                                    'Saved ${queuedScan.cropName} locally! Queued in Isar database [Nakuru County].',
                                    style: const TextStyle(color: Colors.white),
                                  ),
                                ),
                              ],
                            ),
                            duration: const Duration(seconds: 4),
                          ),
                        );

                        // Trigger sync check
                        _syncService.triggerSync();
                      },
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final alert = _locationService.getPestAndWeatherAlert();

    return Scaffold(
      body: SafeArea(
        child: StreamBuilder<SyncState>(
          stream: _syncService.stateStream,
          initialData: _syncService.currentState,
          builder: (context, snapshot) {
            final syncState = snapshot.data ?? _syncService.currentState;

            return Column(
              children: [
                // 1. Top Alert Banner
                AlertBanner(alertMessage: alert),

                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 12),

                        // 2. Header: Logo & Escrow Wallet Card
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              // SokoYield Logo
                              Text.rich(
                                const TextSpan(
                                  children: [
                                    TextSpan(
                                      text: 'Soko',
                                      style: TextStyle(
                                        color: SokoYieldColors.cyberGreen,
                                        fontSize: 26,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: -0.5,
                                      ),
                                    ),
                                    TextSpan(
                                      text: 'Yield',
                                      style: TextStyle(
                                        color: SokoYieldColors.electricGold,
                                        fontSize: 26,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: -0.5,
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              // Escrow Wallet Badge
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                decoration: BoxDecoration(
                                  color: SokoYieldColors.surfaceNavy,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(
                                    color: SokoYieldColors.electricGold.withValues(alpha: 0.6),
                                    width: 1.2,
                                  ),
                                ),
                                child: Row(
                                  children: [
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        const Text(
                                          'Escrow Wallet',
                                          style: TextStyle(
                                            color: SokoYieldColors.textMuted,
                                            fontSize: 10,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                        Text(
                                          'KES ${NumberFormat('#,##0.00').format(_escrowWalletBalance)}',
                                          style: const TextStyle(
                                            color: SokoYieldColors.electricGold,
                                            fontSize: 13,
                                            fontWeight: FontWeight.w800,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(width: 8),
                                    const Icon(
                                      Icons.account_balance_wallet_outlined,
                                      color: SokoYieldColors.electricGold,
                                      size: 20,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 16),

                        // 3. Market Price Ticker
                        const MarketTicker(),

                        const SizedBox(height: 28),

                        // 4. Central Glowing Cyber-Agronomy Scanner Button
                        Center(
                          child: CyberScannerButton(
                            onTap: _onScanTapped,
                            isScanning: _isCapturing,
                          ),
                        ),

                        const SizedBox(height: 28),

                        // 5. Verification Status Pills
                        const StatusPillsRow(
                          yieldPrediction: 'High',
                          cropHealth: 'Checked',
                        ),

                        const SizedBox(height: 24),

                        // 6. Offline Queue & Nakuru Geolocation Inspector
                        OfflineQueueCard(
                          syncState: syncState,
                          currentLocation: _locationService.currentLocation,
                          onToggleOffline: (offline) {
                            _syncService.toggleSimulatedOffline(offline);
                            setState(() {});
                          },
                          onTriggerSync: () {
                            _syncService.triggerSync();
                          },
                        ),

                        const SizedBox(height: 20),
                      ],
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),

      // 7. Cyber-Agronomy Bottom Navigation Bar
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: SokoYieldColors.midnightNavy,
          border: Border(
            top: BorderSide(color: SokoYieldColors.borderLine, width: 1),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentTabIndex,
          onTap: (index) => setState(() => _currentTabIndex = index),
          items: [
            BottomNavigationBarItem(
              icon: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.home_outlined),
                  if (_currentTabIndex == 0)
                    Container(
                      margin: const EdgeInsets.only(top: 4),
                      height: 2,
                      width: 22,
                      color: SokoYieldColors.electricGold,
                    ),
                ],
              ),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.storefront_outlined),
                  if (_currentTabIndex == 1)
                    Container(
                      margin: const EdgeInsets.only(top: 4),
                      height: 2,
                      width: 22,
                      color: SokoYieldColors.electricGold,
                    ),
                ],
              ),
              label: 'Marketplace',
            ),
            BottomNavigationBarItem(
              icon: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.account_balance_wallet_outlined),
                  if (_currentTabIndex == 2)
                    Container(
                      margin: const EdgeInsets.only(top: 4),
                      height: 2,
                      width: 22,
                      color: SokoYieldColors.electricGold,
                    ),
                ],
              ),
              label: 'Escrow Wallet',
            ),
            BottomNavigationBarItem(
              icon: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.bar_chart_outlined),
                  if (_currentTabIndex == 3)
                    Container(
                      margin: const EdgeInsets.only(top: 4),
                      height: 2,
                      width: 22,
                      color: SokoYieldColors.electricGold,
                    ),
                ],
              ),
              label: 'Insights',
            ),
          ],
        ),
      ),
    );
  }
}
