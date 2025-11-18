/// API Constants and Endpoints
class ApiConstants {
  ApiConstants._();

  // Base URLs
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:8080', // API Gateway
  );

  static const String marketIntelligenceBaseUrl = String.fromEnvironment(
    'MARKET_INTELLIGENCE_URL',
    defaultValue: 'http://localhost:8004',
  );

  // API Version
  static const String apiVersion = '/api/v1';

  // Timeout
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  static const Duration sendTimeout = Duration(seconds: 30);

  // ========== Market Intelligence Endpoints ==========

  // Market Test Express
  static const String marketTest = '$apiVersion/validation/market-test';
  static const String marketTestHistory = '$apiVersion/validation/market-test/history';

  // Benchmark Automático
  static const String benchmark = '$apiVersion/validation/benchmark';
  static const String benchmarkHistory = '$apiVersion/validation/benchmark/history';

  // Target Audience Generator
  static const String targetAudience = '$apiVersion/validation/target-audience';
  static const String targetAudienceHistory = '$apiVersion/validation/target-audience/history';

  // ========== Auth Endpoints ==========
  static const String login = '$apiVersion/auth/login';
  static const String register = '$apiVersion/auth/register';
  static const String logout = '$apiVersion/auth/logout';
  static const String refreshToken = '$apiVersion/auth/refresh';
  static const String verifyEmail = '$apiVersion/auth/verify-email';
  static const String resetPassword = '$apiVersion/auth/reset-password';

  // ========== User Endpoints ==========
  static const String userProfile = '$apiVersion/user/profile';
  static const String updateProfile = '$apiVersion/user/profile';
  static const String changePassword = '$apiVersion/user/change-password';
  static const String deleteAccount = '$apiVersion/user/delete';

  // ========== Business Endpoints ==========
  static const String businesses = '$apiVersion/businesses';
  static const String createBusiness = '$apiVersion/businesses';
  static String businessById(String id) => '$apiVersion/businesses/$id';

  // ========== Health Check ==========
  static const String healthCheck = '$apiVersion/health';
}

/// Storage Keys for local data
class StorageKeys {
  StorageKeys._();

  static const String accessToken = 'access_token';
  static const String refreshToken = 'refresh_token';
  static const String userId = 'user_id';
  static const String userEmail = 'user_email';
  static const String userName = 'user_name';
  static const String isFirstLaunch = 'is_first_launch';
  static const String isDarkMode = 'is_dark_mode';
  static const String languageCode = 'language_code';
  static const String currentBusinessId = 'current_business_id';
  static const String hasCompletedOnboarding = 'has_completed_onboarding';
}

/// App Constants
class AppConstants {
  AppConstants._();

  static const String appName = 'Pueblo Mente';
  static const String appVersion = '1.0.0';

  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;

  // Cache Duration
  static const Duration cacheDuration = Duration(hours: 1);

  // Business Stages
  static const String stageValidation = 'validation';
  static const String stageOperating = 'operating';
  static const String stageConsolidated = 'consolidated';
  static const String stageGlobal = 'global';

  // Supported Currencies
  static const List<String> supportedCurrencies = [
    'USD',
    'EUR',
    'GBP',
    'CAD',
    'AUD',
    'MXN',
    'ARS',
    'BRL',
    'CLP',
    'COP',
  ];

  // Supported Countries
  static const Map<String, String> supportedCountries = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'CA': 'Canada',
    'AU': 'Australia',
    'DE': 'Germany',
    'FR': 'France',
    'ES': 'Spain',
    'MX': 'Mexico',
    'AR': 'Argentina',
    'BR': 'Brazil',
    'CL': 'Chile',
    'CO': 'Colombia',
  };
}

/// Error Messages
class ErrorMessages {
  ErrorMessages._();

  static const String networkError = 'Network error. Please check your connection.';
  static const String serverError = 'Server error. Please try again later.';
  static const String unknownError = 'An unknown error occurred.';
  static const String validationError = 'Please check your input and try again.';
  static const String authError = 'Authentication failed. Please login again.';
  static const String notFoundError = 'Resource not found.';
  static const String timeoutError = 'Request timeout. Please try again.';
  static const String emptyFieldError = 'This field cannot be empty.';
}
