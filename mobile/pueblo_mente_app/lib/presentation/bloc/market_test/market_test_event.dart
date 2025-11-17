import 'package:freezed_annotation/freezed_annotation.dart';
import '../../../domain/entities/market_test_entity.dart';

part 'market_test_event.freezed.dart';

/// Market Test Events - User actions
@freezed
class MarketTestEvent with _$MarketTestEvent {
  /// Submit market test for analysis
  const factory MarketTestEvent.submitMarketTest({
    required String ideaDescription,
    required String targetMarket,
    required String currency,
    required String country,
    String? industry,
    double? initialInvestment,
  }) = _SubmitMarketTest;

  /// Load market test history
  const factory MarketTestEvent.loadHistory({
    @Default(10) int limit,
  }) = _LoadHistory;

  /// Load specific market test by ID
  const factory MarketTestEvent.loadMarketTestById({
    required String testId,
  }) = _LoadMarketTestById;

  /// Delete market test
  const factory MarketTestEvent.deleteMarketTest({
    required String testId,
  }) = _DeleteMarketTest;

  /// Retry failed operation
  const factory MarketTestEvent.retry() = _Retry;

  /// Reset to initial state
  const factory MarketTestEvent.reset() = _Reset;

  /// Load cached tests (offline)
  const factory MarketTestEvent.loadCachedTests() = _LoadCachedTests;
}
