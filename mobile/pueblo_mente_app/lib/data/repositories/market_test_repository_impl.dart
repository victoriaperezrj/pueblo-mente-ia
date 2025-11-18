import 'package:dartz/dartz.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import '../../core/error/failures.dart';
import '../../domain/entities/market_test_entity.dart';
import '../../domain/repositories/market_test_repository.dart';
import '../datasources/market_test_local_datasource.dart';
import '../datasources/market_test_remote_datasource.dart';
import '../models/market_test_model.dart';

/// Market Test Repository Implementation
/// Implements offline-first strategy with proper error handling
class MarketTestRepositoryImpl implements MarketTestRepository {
  final MarketTestRemoteDataSource remoteDataSource;
  final MarketTestLocalDataSource localDataSource;
  final Connectivity connectivity;

  MarketTestRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.connectivity,
  });

  @override
  Future<Either<Failure, MarketTestEntity>> analyzeMarket(
    MarketTestRequestEntity request,
  ) async {
    // Check network connectivity
    final isConnected = await _isConnected();
    if (!isConnected) {
      return const Left(NetworkFailure('No internet connection'));
    }

    try {
      // Convert entity to model
      final requestModel = MarketTestRequestModel.fromEntity(request);

      // Call remote API
      final result = await remoteDataSource.analyzeMarket(requestModel);

      // Cache result for offline access
      await localDataSource.cacheMarketTest(result);

      // Update last sync time
      await localDataSource.updateLastSyncTime(DateTime.now());

      // Return entity
      return Right(result.toEntity());
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } on TimeoutException catch (e) {
      return Left(TimeoutFailure(e.message));
    } on ValidationException catch (e) {
      return Left(ValidationFailure(e.message));
    } on AuthenticationException catch (e) {
      return Left(AuthFailure(e.message));
    } on NotFoundException catch (e) {
      return Left(NotFoundFailure(e.message));
    } catch (e) {
      return Left(UnknownFailure('Unexpected error: $e'));
    }
  }

  @override
  Future<Either<Failure, List<MarketTestEntity>>> getMarketTestHistory({
    required String userId,
    int limit = 10,
  }) async {
    // Try remote first if connected
    final isConnected = await _isConnected();

    if (isConnected) {
      try {
        final results = await remoteDataSource.getMarketTestHistory(
          userId: userId,
          limit: limit,
        );

        // Cache all results
        for (final result in results) {
          await localDataSource.cacheMarketTest(result);
        }

        await localDataSource.updateLastSyncTime(DateTime.now());

        return Right(results.map((model) => model.toEntity()).toList());
      } on ServerException catch (e) {
        // Fall back to cache on server error
        return _getCachedHistory(userId);
      } on NetworkException catch (e) {
        return _getCachedHistory(userId);
      } on TimeoutException catch (e) {
        return _getCachedHistory(userId);
      } catch (e) {
        return _getCachedHistory(userId);
      }
    } else {
      // Offline - return cached data
      return _getCachedHistory(userId);
    }
  }

  @override
  Future<Either<Failure, MarketTestEntity>> getMarketTestById(
    String testId,
  ) async {
    // Try local cache first (faster)
    try {
      final cached = await localDataSource.getCachedMarketTest(testId);
      if (cached != null) {
        return Right(cached.toEntity());
      }
    } on CacheException catch (e) {
      // Continue to remote if cache fails
    }

    // Try remote if connected
    final isConnected = await _isConnected();
    if (!isConnected) {
      return const Left(
        NotFoundFailure('Market test not found in cache and no internet connection'),
      );
    }

    try {
      final result = await remoteDataSource.getMarketTestById(testId);
      await localDataSource.cacheMarketTest(result);
      return Right(result.toEntity());
    } on NotFoundException catch (e) {
      return Left(NotFoundFailure(e.message));
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return Left(NetworkFailure(e.message));
    } catch (e) {
      return Left(UnknownFailure('Unexpected error: $e'));
    }
  }

  @override
  Future<Either<Failure, bool>> deleteMarketTest(String testId) async {
    // Delete from cache immediately
    try {
      await localDataSource.deleteCachedMarketTest(testId);
    } on CacheException catch (e) {
      // Continue even if cache delete fails
    }

    // Try remote delete if connected
    final isConnected = await _isConnected();
    if (!isConnected) {
      return const Right(true); // Deleted locally, will sync later
    }

    try {
      final result = await remoteDataSource.deleteMarketTest(testId);
      return Right(result);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message));
    } on NetworkException catch (e) {
      return const Right(true); // Deleted locally
    } catch (e) {
      return Left(UnknownFailure('Unexpected error: $e'));
    }
  }

  @override
  Future<Either<Failure, List<MarketTestEntity>>> getCachedMarketTests() async {
    try {
      final results = await localDataSource.getCachedMarketTests('current-user-id');
      return Right(results.map((model) => model.toEntity()).toList());
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    } catch (e) {
      return Left(UnknownFailure('Unexpected error: $e'));
    }
  }

  @override
  Future<Either<Failure, bool>> cacheMarketTest(MarketTestEntity test) async {
    try {
      final model = MarketTestModel.fromEntity(test);
      await localDataSource.cacheMarketTest(model);
      return const Right(true);
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    } catch (e) {
      return Left(UnknownFailure('Unexpected error: $e'));
    }
  }

  // Helper methods

  /// Get cached history as fallback
  Future<Either<Failure, List<MarketTestEntity>>> _getCachedHistory(
    String userId,
  ) async {
    try {
      final cached = await localDataSource.getCachedMarketTests(userId);
      if (cached.isEmpty) {
        return const Left(
          NotFoundFailure('No cached data available. Please connect to internet.'),
        );
      }
      return Right(cached.map((model) => model.toEntity()).toList());
    } on CacheException catch (e) {
      return Left(CacheFailure(e.message));
    } catch (e) {
      return Left(UnknownFailure('Unexpected error: $e'));
    }
  }

  /// Check if device is connected to internet
  Future<bool> _isConnected() async {
    try {
      final connectivityResult = await connectivity.checkConnectivity();
      return connectivityResult != ConnectivityResult.none;
    } catch (e) {
      // Assume connected if check fails
      return true;
    }
  }
}
