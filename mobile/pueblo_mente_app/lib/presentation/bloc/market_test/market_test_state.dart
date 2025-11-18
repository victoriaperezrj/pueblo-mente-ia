import 'package:freezed_annotation/freezed_annotation.dart';
import '../../../domain/entities/market_test_entity.dart';

part 'market_test_state.freezed.dart';

/// Market Test States - UI states with proper separation
@freezed
class MarketTestState with _$MarketTestState {
  /// Initial state
  const factory MarketTestState.initial() = _Initial;

  /// Loading state (analyzing market)
  const factory MarketTestState.analyzing({
    @Default('Analyzing market with AI...') String message,
  }) = _Analyzing;

  /// Success state with result
  const factory MarketTestState.analysisSuccess({
    required MarketTestEntity result,
  }) = _AnalysisSuccess;

  /// Loading history
  const factory MarketTestState.loadingHistory() = _LoadingHistory;

  /// History loaded successfully
  const factory MarketTestState.historyLoaded({
    required List<MarketTestEntity> tests,
  }) = _HistoryLoaded;

  /// Deleting test
  const factory MarketTestState.deleting({
    required String testId,
  }) = _Deleting;

  /// Delete success
  const factory MarketTestState.deleteSuccess({
    required String testId,
  }) = _DeleteSuccess;

  /// Error state with failure details
  const factory MarketTestState.error({
    required String message,
    String? errorCode,
    @Default(false) bool isNetworkError,
  }) = _Error;

  /// Offline state with cached data
  const factory MarketTestState.offline({
    required List<MarketTestEntity> cachedTests,
    String? message,
  }) = _Offline;
}
