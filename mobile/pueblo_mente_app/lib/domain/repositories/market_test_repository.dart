import 'package:dartz/dartz.dart';
import '../../core/error/failures.dart';
import '../entities/market_test_entity.dart';

/// Market Test Repository Interface - Domain layer
abstract class MarketTestRepository {
  /// Analyze market viability
  Future<Either<Failure, MarketTestEntity>> analyzeMarket(
    MarketTestRequestEntity request,
  );

  /// Get user's market test history
  Future<Either<Failure, List<MarketTestEntity>>> getMarketTestHistory({
    required String userId,
    int limit = 10,
  });

  /// Get specific market test by ID
  Future<Either<Failure, MarketTestEntity>> getMarketTestById(String testId);

  /// Delete market test
  Future<Either<Failure, bool>> deleteMarketTest(String testId);

  /// Get cached market tests (offline support)
  Future<Either<Failure, List<MarketTestEntity>>> getCachedMarketTests();

  /// Save market test to cache
  Future<Either<Failure, bool>> cacheMarketTest(MarketTestEntity test);
}
