import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import '../../../domain/entities/market_test_entity.dart';
import '../../../domain/repositories/market_test_repository.dart';
import '../../../core/error/failures.dart';
import 'market_test_event.dart';
import 'market_test_state.dart';

/// Market Test BLoC - Business Logic Component
/// Handles all market test operations with proper state management
@injectable
class MarketTestBloc extends Bloc<MarketTestEvent, MarketTestState> {
  final MarketTestRepository _repository;

  // Cache last event for retry functionality
  MarketTestEvent? _lastEvent;

  MarketTestBloc(this._repository) : super(const MarketTestState.initial()) {
    // Register event handlers
    on<_SubmitMarketTest>(_onSubmitMarketTest);
    on<_LoadHistory>(_onLoadHistory);
    on<_LoadMarketTestById>(_onLoadMarketTestById);
    on<_DeleteMarketTest>(_onDeleteMarketTest);
    on<_Retry>(_onRetry);
    on<_Reset>(_onReset);
    on<_LoadCachedTests>(_onLoadCachedTests);
  }

  /// Handle market test submission
  Future<void> _onSubmitMarketTest(
    _SubmitMarketTest event,
    Emitter<MarketTestState> emit,
  ) async {
    // Save for retry
    _lastEvent = event;

    // Validate input
    if (event.ideaDescription.trim().length < 10) {
      emit(const MarketTestState.error(
        message: 'Please provide a detailed business idea description (at least 10 characters)',
      ));
      return;
    }

    if (event.targetMarket.trim().length < 3) {
      emit(const MarketTestState.error(
        message: 'Please describe your target market',
      ));
      return;
    }

    // Emit analyzing state
    emit(const MarketTestState.analyzing(
      message: 'Analyzing your business idea with GPT-4...',
    ));

    // Create request entity
    final request = MarketTestRequestEntity(
      userId: 'current-user-id', // TODO: Get from auth
      ideaDescription: event.ideaDescription.trim(),
      targetMarket: event.targetMarket.trim(),
      currency: event.currency,
      country: event.country,
      industry: event.industry,
      initialInvestment: event.initialInvestment,
    );

    // Call repository
    final result = await _repository.analyzeMarket(request);

    // Handle result with pattern matching
    result.fold(
      (failure) {
        emit(_mapFailureToErrorState(failure));
      },
      (marketTest) {
        emit(MarketTestState.analysisSuccess(result: marketTest));
      },
    );
  }

  /// Handle loading history
  Future<void> _onLoadHistory(
    _LoadHistory event,
    Emitter<MarketTestState> emit,
  ) async {
    _lastEvent = event;

    emit(const MarketTestState.loadingHistory());

    final result = await _repository.getMarketTestHistory(
      userId: 'current-user-id', // TODO: Get from auth
      limit: event.limit,
    );

    result.fold(
      (failure) {
        if (failure is NetworkFailure) {
          // Try to load cached tests as fallback
          add(const MarketTestEvent.loadCachedTests());
        } else {
          emit(_mapFailureToErrorState(failure));
        }
      },
      (tests) {
        emit(MarketTestState.historyLoaded(tests: tests));
      },
    );
  }

  /// Handle loading market test by ID
  Future<void> _onLoadMarketTestById(
    _LoadMarketTestById event,
    Emitter<MarketTestState> emit,
  ) async {
    _lastEvent = event;

    emit(const MarketTestState.analyzing(
      message: 'Loading market test...',
    ));

    final result = await _repository.getMarketTestById(event.testId);

    result.fold(
      (failure) {
        emit(_mapFailureToErrorState(failure));
      },
      (test) {
        emit(MarketTestState.analysisSuccess(result: test));
      },
    );
  }

  /// Handle deleting market test
  Future<void> _onDeleteMarketTest(
    _DeleteMarketTest event,
    Emitter<MarketTestState> emit,
  ) async {
    _lastEvent = event;

    emit(MarketTestState.deleting(testId: event.testId));

    final result = await _repository.deleteMarketTest(event.testId);

    result.fold(
      (failure) {
        emit(_mapFailureToErrorState(failure));
      },
      (success) {
        emit(MarketTestState.deleteSuccess(testId: event.testId));
        // Reload history after delete
        add(const MarketTestEvent.loadHistory());
      },
    );
  }

  /// Handle retry
  Future<void> _onRetry(
    _Retry event,
    Emitter<MarketTestState> emit,
  ) async {
    if (_lastEvent != null) {
      add(_lastEvent!);
    } else {
      emit(const MarketTestState.error(
        message: 'No previous operation to retry',
      ));
    }
  }

  /// Handle reset
  Future<void> _onReset(
    _Reset event,
    Emitter<MarketTestState> emit,
  ) async {
    _lastEvent = null;
    emit(const MarketTestState.initial());
  }

  /// Handle loading cached tests (offline mode)
  Future<void> _onLoadCachedTests(
    _LoadCachedTests event,
    Emitter<MarketTestState> emit,
  ) async {
    final result = await _repository.getCachedMarketTests();

    result.fold(
      (failure) {
        emit(MarketTestState.error(
          message: failure.message,
          isNetworkError: failure is NetworkFailure,
        ));
      },
      (tests) {
        if (tests.isEmpty) {
          emit(const MarketTestState.offline(
            cachedTests: [],
            message: 'No cached data available. Please connect to internet to analyze new ideas.',
          ));
        } else {
          emit(MarketTestState.offline(
            cachedTests: tests,
            message: 'Showing ${tests.length} cached test(s). Connect to internet for new analysis.',
          ));
        }
      },
    );
  }

  /// Map failure to error state with appropriate message
  MarketTestState _mapFailureToErrorState(Failure failure) {
    String message;
    bool isNetworkError = false;

    if (failure is ServerFailure) {
      message = failure.message;
    } else if (failure is NetworkFailure) {
      message = failure.message;
      isNetworkError = true;
    } else if (failure is TimeoutFailure) {
      message = failure.message;
      isNetworkError = true;
    } else if (failure is ValidationFailure) {
      message = failure.message;
    } else if (failure is AuthFailure) {
      message = failure.message;
    } else if (failure is NotFoundFailure) {
      message = failure.message;
    } else if (failure is CacheFailure) {
      message = failure.message;
    } else {
      message = 'An unexpected error occurred. Please try again.';
    }

    return MarketTestState.error(
      message: message,
      isNetworkError: isNetworkError,
    );
  }
}
