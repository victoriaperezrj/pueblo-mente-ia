import 'package:hive_flutter/hive_flutter.dart';
import '../models/market_test_model.dart';

/// Market Test Local Data Source
/// Handles local caching with Hive for offline-first experience
abstract class MarketTestLocalDataSource {
  /// Cache market test result
  Future<void> cacheMarketTest(MarketTestModel test);

  /// Get cached market test by ID
  Future<MarketTestModel?> getCachedMarketTest(String testId);

  /// Get all cached market tests for user
  Future<List<MarketTestModel>> getCachedMarketTests(String userId);

  /// Delete cached market test
  Future<void> deleteCachedMarketTest(String testId);

  /// Clear all cached market tests
  Future<void> clearCache();

  /// Get last sync timestamp
  Future<DateTime?> getLastSyncTime();

  /// Update last sync timestamp
  Future<void> updateLastSyncTime(DateTime timestamp);
}

/// Implementation with Hive
class MarketTestLocalDataSourceImpl implements MarketTestLocalDataSource {
  static const String _marketTestBoxName = 'market_tests';
  static const String _metadataBoxName = 'market_test_metadata';
  static const String _lastSyncKey = 'last_sync_time';

  late final Box<String> _marketTestBox;
  late final Box<String> _metadataBox;

  MarketTestLocalDataSourceImpl();

  /// Initialize Hive boxes
  Future<void> init() async {
    _marketTestBox = await Hive.openBox<String>(_marketTestBoxName);
    _metadataBox = await Hive.openBox<String>(_metadataBoxName);
  }

  @override
  Future<void> cacheMarketTest(MarketTestModel test) async {
    try {
      final json = test.toJson();
      final jsonString = _encodeJson(json);
      await _marketTestBox.put(test.testId, jsonString);
    } catch (e) {
      throw CacheException('Failed to cache market test: $e');
    }
  }

  @override
  Future<MarketTestModel?> getCachedMarketTest(String testId) async {
    try {
      final jsonString = _marketTestBox.get(testId);
      if (jsonString == null) return null;

      final json = _decodeJson(jsonString);
      return MarketTestModel.fromJson(json);
    } catch (e) {
      throw CacheException('Failed to get cached market test: $e');
    }
  }

  @override
  Future<List<MarketTestModel>> getCachedMarketTests(String userId) async {
    try {
      final allTests = <MarketTestModel>[];

      for (final jsonString in _marketTestBox.values) {
        try {
          final json = _decodeJson(jsonString);
          final test = MarketTestModel.fromJson(json);
          allTests.add(test);
        } catch (e) {
          // Skip invalid entries
          continue;
        }
      }

      // Sort by analysis date (most recent first)
      allTests.sort((a, b) =>
        DateTime.parse(b.analysisDate).compareTo(DateTime.parse(a.analysisDate))
      );

      return allTests;
    } catch (e) {
      throw CacheException('Failed to get cached market tests: $e');
    }
  }

  @override
  Future<void> deleteCachedMarketTest(String testId) async {
    try {
      await _marketTestBox.delete(testId);
    } catch (e) {
      throw CacheException('Failed to delete cached market test: $e');
    }
  }

  @override
  Future<void> clearCache() async {
    try {
      await _marketTestBox.clear();
    } catch (e) {
      throw CacheException('Failed to clear cache: $e');
    }
  }

  @override
  Future<DateTime?> getLastSyncTime() async {
    try {
      final timestampString = _metadataBox.get(_lastSyncKey);
      if (timestampString == null) return null;

      return DateTime.parse(timestampString);
    } catch (e) {
      return null;
    }
  }

  @override
  Future<void> updateLastSyncTime(DateTime timestamp) async {
    try {
      await _metadataBox.put(_lastSyncKey, timestamp.toIso8601String());
    } catch (e) {
      throw CacheException('Failed to update last sync time: $e');
    }
  }

  // Helper methods for JSON encoding/decoding
  String _encodeJson(Map<String, dynamic> json) {
    // Convert to JSON string for Hive storage
    return json.toString();
  }

  Map<String, dynamic> _decodeJson(String jsonString) {
    // Parse JSON string from Hive
    // Note: In production, use proper JSON encoding (dart:convert)
    // This is simplified for demonstration
    try {
      // TODO: Use jsonDecode from dart:convert
      return {};
    } catch (e) {
      throw CacheException('Failed to decode JSON: $e');
    }
  }

  /// Close Hive boxes
  Future<void> dispose() async {
    await _marketTestBox.close();
    await _metadataBox.close();
  }
}

/// Cache Exception
class CacheException implements Exception {
  final String message;
  CacheException(this.message);

  @override
  String toString() => message;
}
