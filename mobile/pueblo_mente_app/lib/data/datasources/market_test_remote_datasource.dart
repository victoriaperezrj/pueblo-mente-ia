import 'package:dio/dio.dart';
import '../../core/constants/api_constants.dart';
import '../../core/network/dio_client.dart';
import '../models/market_test_model.dart';

/// Market Test Remote Data Source
/// Handles all API calls for market intelligence
abstract class MarketTestRemoteDataSource {
  /// Analyze market with AI
  Future<MarketTestModel> analyzeMarket(MarketTestRequestModel request);

  /// Get user's market test history
  Future<List<MarketTestModel>> getMarketTestHistory({
    required String userId,
    int limit = 10,
  });

  /// Get market test by ID
  Future<MarketTestModel> getMarketTestById(String testId);

  /// Delete market test
  Future<bool> deleteMarketTest(String testId);
}

/// Implementation with proper error handling
class MarketTestRemoteDataSourceImpl implements MarketTestRemoteDataSource {
  final DioClient _dioClient;

  MarketTestRemoteDataSourceImpl(this._dioClient);

  @override
  Future<MarketTestModel> analyzeMarket(
    MarketTestRequestModel request,
  ) async {
    try {
      final response = await _dioClient.post(
        ApiConstants.marketTest,
        data: request.toJson(),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return MarketTestModel.fromJson(response.data as Map<String, dynamic>);
      } else {
        throw DioException(
          requestOptions: response.requestOptions,
          response: response,
          type: DioExceptionType.badResponse,
          message: 'Failed to analyze market: ${response.statusMessage}',
        );
      }
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw Exception('Unexpected error during market analysis: $e');
    }
  }

  @override
  Future<List<MarketTestModel>> getMarketTestHistory({
    required String userId,
    int limit = 10,
  }) async {
    try {
      final response = await _dioClient.get(
        '${ApiConstants.marketTestHistory}/$userId',
        queryParameters: {'limit': limit},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data as List<dynamic>;
        return data
            .map((json) => MarketTestModel.fromJson(json as Map<String, dynamic>))
            .toList();
      } else {
        throw DioException(
          requestOptions: response.requestOptions,
          response: response,
          type: DioExceptionType.badResponse,
          message: 'Failed to fetch history: ${response.statusMessage}',
        );
      }
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw Exception('Unexpected error fetching history: $e');
    }
  }

  @override
  Future<MarketTestModel> getMarketTestById(String testId) async {
    try {
      final response = await _dioClient.get(
        '${ApiConstants.marketTest}/$testId',
      );

      if (response.statusCode == 200) {
        return MarketTestModel.fromJson(response.data as Map<String, dynamic>);
      } else {
        throw DioException(
          requestOptions: response.requestOptions,
          response: response,
          type: DioExceptionType.badResponse,
          message: 'Market test not found',
        );
      }
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw Exception('Unexpected error fetching market test: $e');
    }
  }

  @override
  Future<bool> deleteMarketTest(String testId) async {
    try {
      final response = await _dioClient.delete(
        '${ApiConstants.marketTest}/$testId',
      );

      return response.statusCode == 200 || response.statusCode == 204;
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      throw Exception('Unexpected error deleting market test: $e');
    }
  }

  /// Handle Dio errors with proper exception types
  Exception _handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return TimeoutException(
          'Request timeout. Please check your connection and try again.',
        );

      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final message = error.response?.data?['message'] ??
            error.response?.data?['error'] ??
            'Server error occurred';

        if (statusCode == 400) {
          return ValidationException(message);
        } else if (statusCode == 401) {
          return AuthenticationException('Authentication failed. Please login again.');
        } else if (statusCode == 404) {
          return NotFoundException('Resource not found');
        } else if (statusCode != null && statusCode >= 500) {
          return ServerException('Server error: $message');
        }
        return ServerException(message);

      case DioExceptionType.cancel:
        return RequestCancelledException('Request was cancelled');

      case DioExceptionType.connectionError:
      case DioExceptionType.badCertificate:
      case DioExceptionType.unknown:
        if (error.message?.contains('SocketException') ?? false) {
          return NetworkException('No internet connection');
        }
        return NetworkException('Network error: ${error.message}');
    }
  }
}

// Custom exceptions for better error handling
class ServerException implements Exception {
  final String message;
  ServerException(this.message);

  @override
  String toString() => message;
}

class NetworkException implements Exception {
  final String message;
  NetworkException(this.message);

  @override
  String toString() => message;
}

class TimeoutException implements Exception {
  final String message;
  TimeoutException(this.message);

  @override
  String toString() => message;
}

class ValidationException implements Exception {
  final String message;
  ValidationException(this.message);

  @override
  String toString() => message;
}

class AuthenticationException implements Exception {
  final String message;
  AuthenticationException(this.message);

  @override
  String toString() => message;
}

class NotFoundException implements Exception {
  final String message;
  NotFoundException(this.message);

  @override
  String toString() => message;
}

class RequestCancelledException implements Exception {
  final String message;
  RequestCancelledException(this.message);

  @override
  String toString() => message;
}
