import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/market_test_entity.dart';

part 'market_test_model.freezed.dart';
part 'market_test_model.g.dart';

/// Market Test Model - Data layer with JSON serialization
@freezed
class MarketTestModel with _$MarketTestModel {
  const factory MarketTestModel({
    @JsonKey(name: 'test_id') required String testId,
    @JsonKey(name: 'viability_score') required double viabilityScore,
    @JsonKey(name: 'market_size') required String marketSize,
    @JsonKey(name: 'market_size_description') required String marketSizeDescription,
    @JsonKey(name: 'competition_level') required String competitionLevel,
    @JsonKey(name: 'risk_level') required String riskLevel,
    required List<String> strengths,
    required List<String> weaknesses,
    required List<String> opportunities,
    required List<String> threats,
    required List<String> recommendations,
    @JsonKey(name: 'next_steps') required List<String> nextSteps,
    @JsonKey(name: 'estimated_market_size_usd') double? estimatedMarketSizeUsd,
    @JsonKey(name: 'estimated_startup_cost') StartupCostModel? estimatedStartupCost,
    @JsonKey(name: 'revenue_potential') String? revenuePotential,
    @JsonKey(name: 'time_to_market') String? timeToMarket,
    @JsonKey(name: 'analysis_date') required String analysisDate,
    @JsonKey(name: 'gpt_model_used') required String gptModelUsed,
    @JsonKey(name: 'confidence_level') required double confidenceLevel,
  }) = _MarketTestModel;

  const MarketTestModel._();

  /// From JSON
  factory MarketTestModel.fromJson(Map<String, dynamic> json) =>
      _$MarketTestModelFromJson(json);

  /// To Entity (Domain layer)
  MarketTestEntity toEntity() {
    return MarketTestEntity(
      testId: testId,
      viabilityScore: viabilityScore,
      marketSize: _parseMarketSize(marketSize),
      marketSizeDescription: marketSizeDescription,
      competitionLevel: _parseCompetitionLevel(competitionLevel),
      riskLevel: _parseRiskLevel(riskLevel),
      strengths: strengths,
      weaknesses: weaknesses,
      opportunities: opportunities,
      threats: threats,
      recommendations: recommendations,
      nextSteps: nextSteps,
      estimatedMarketSizeUsd: estimatedMarketSizeUsd,
      estimatedStartupCost: estimatedStartupCost?.toEntity(),
      revenuePotential: revenuePotential,
      timeToMarket: timeToMarket,
      analysisDate: DateTime.parse(analysisDate),
      gptModelUsed: gptModelUsed,
      confidenceLevel: confidenceLevel,
    );
  }

  /// From Entity
  factory MarketTestModel.fromEntity(MarketTestEntity entity) {
    return MarketTestModel(
      testId: entity.testId,
      viabilityScore: entity.viabilityScore,
      marketSize: entity.marketSize.name,
      marketSizeDescription: entity.marketSizeDescription,
      competitionLevel: entity.competitionLevel.name,
      riskLevel: entity.riskLevel.name,
      strengths: entity.strengths,
      weaknesses: entity.weaknesses,
      opportunities: entity.opportunities,
      threats: entity.threats,
      recommendations: entity.recommendations,
      nextSteps: entity.nextSteps,
      estimatedMarketSizeUsd: entity.estimatedMarketSizeUsd,
      estimatedStartupCost: entity.estimatedStartupCost != null
          ? StartupCostModel.fromEntity(entity.estimatedStartupCost!)
          : null,
      revenuePotential: entity.revenuePotential,
      timeToMarket: entity.timeToMarket,
      analysisDate: entity.analysisDate.toIso8601String(),
      gptModelUsed: entity.gptModelUsed,
      confidenceLevel: entity.confidenceLevel,
    );
  }

  // Helper parsers
  static MarketSize _parseMarketSize(String value) {
    return MarketSize.values.firstWhere(
      (e) => e.name.toLowerCase() == value.toLowerCase(),
      orElse: () => MarketSize.medium,
    );
  }

  static CompetitionLevel _parseCompetitionLevel(String value) {
    return CompetitionLevel.values.firstWhere(
      (e) => e.name.toLowerCase() == value.toLowerCase(),
      orElse: () => CompetitionLevel.medium,
    );
  }

  static RiskLevel _parseRiskLevel(String value) {
    return RiskLevel.values.firstWhere(
      (e) => e.name.toLowerCase() == value.toLowerCase(),
      orElse: () => RiskLevel.medium,
    );
  }
}

/// Startup Cost Model
@freezed
class StartupCostModel with _$StartupCostModel {
  const factory StartupCostModel({
    required double minimum,
    required double realistic,
    required double optimal,
    required Map<String, double> breakdown,
  }) = _StartupCostModel;

  const StartupCostModel._();

  factory StartupCostModel.fromJson(Map<String, dynamic> json) =>
      _$StartupCostModelFromJson(json);

  StartupCost toEntity() {
    return StartupCost(
      minimum: minimum,
      realistic: realistic,
      optimal: optimal,
      breakdown: breakdown,
    );
  }

  factory StartupCostModel.fromEntity(StartupCost entity) {
    return StartupCostModel(
      minimum: entity.minimum,
      realistic: entity.realistic,
      optimal: entity.optimal,
      breakdown: entity.breakdown,
    );
  }
}

/// Market Test Request Model
@freezed
class MarketTestRequestModel with _$MarketTestRequestModel {
  const factory MarketTestRequestModel({
    @JsonKey(name: 'user_id') required String userId,
    @JsonKey(name: 'business_id') String? businessId,
    @JsonKey(name: 'idea_description') required String ideaDescription,
    @JsonKey(name: 'target_market') required String targetMarket,
    @JsonKey(name: 'initial_investment') double? initialInvestment,
    required String currency,
    required String country,
    String? industry,
  }) = _MarketTestRequestModel;

  const MarketTestRequestModel._();

  factory MarketTestRequestModel.fromJson(Map<String, dynamic> json) =>
      _$MarketTestRequestModelFromJson(json);

  /// From Entity
  factory MarketTestRequestModel.fromEntity(MarketTestRequestEntity entity) {
    return MarketTestRequestModel(
      userId: entity.userId,
      businessId: entity.businessId,
      ideaDescription: entity.ideaDescription,
      targetMarket: entity.targetMarket,
      initialInvestment: entity.initialInvestment,
      currency: entity.currency,
      country: entity.country,
      industry: entity.industry,
    );
  }

  /// To Entity
  MarketTestRequestEntity toEntity() {
    return MarketTestRequestEntity(
      userId: userId,
      businessId: businessId,
      ideaDescription: ideaDescription,
      targetMarket: targetMarket,
      initialInvestment: initialInvestment,
      currency: currency,
      country: country,
      industry: industry,
    );
  }
}
