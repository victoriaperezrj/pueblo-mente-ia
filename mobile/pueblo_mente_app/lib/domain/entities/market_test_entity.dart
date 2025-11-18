import 'package:equatable/equatable.dart';

/// Market Test Entity - Domain layer
class MarketTestEntity extends Equatable {
  final String testId;
  final double viabilityScore;
  final MarketSize marketSize;
  final String marketSizeDescription;
  final CompetitionLevel competitionLevel;
  final RiskLevel riskLevel;
  final List<String> strengths;
  final List<String> weaknesses;
  final List<String> opportunities;
  final List<String> threats;
  final List<String> recommendations;
  final List<String> nextSteps;
  final double? estimatedMarketSizeUsd;
  final StartupCost? estimatedStartupCost;
  final String? revenuePotential;
  final String? timeToMarket;
  final DateTime analysisDate;
  final String gptModelUsed;
  final double confidenceLevel;

  const MarketTestEntity({
    required this.testId,
    required this.viabilityScore,
    required this.marketSize,
    required this.marketSizeDescription,
    required this.competitionLevel,
    required this.riskLevel,
    required this.strengths,
    required this.weaknesses,
    required this.opportunities,
    required this.threats,
    required this.recommendations,
    required this.nextSteps,
    this.estimatedMarketSizeUsd,
    this.estimatedStartupCost,
    this.revenuePotential,
    this.timeToMarket,
    required this.analysisDate,
    required this.gptModelUsed,
    required this.confidenceLevel,
  });

  @override
  List<Object?> get props => [
        testId,
        viabilityScore,
        marketSize,
        competitionLevel,
        riskLevel,
      ];
}

/// Market Size enum
enum MarketSize {
  niche,
  small,
  medium,
  large,
  massive;

  String get displayName {
    switch (this) {
      case MarketSize.niche:
        return 'Niche';
      case MarketSize.small:
        return 'Small';
      case MarketSize.medium:
        return 'Medium';
      case MarketSize.large:
        return 'Large';
      case MarketSize.massive:
        return 'Massive';
    }
  }
}

/// Competition Level enum
enum CompetitionLevel {
  low,
  medium,
  high;

  String get displayName {
    switch (this) {
      case CompetitionLevel.low:
        return 'Low';
      case CompetitionLevel.medium:
        return 'Medium';
      case CompetitionLevel.high:
        return 'High';
    }
  }
}

/// Risk Level enum
enum RiskLevel {
  low,
  medium,
  high;

  String get displayName {
    switch (this) {
      case RiskLevel.low:
        return 'Low';
      case RiskLevel.medium:
        return 'Medium';
      case RiskLevel.high:
        return 'High';
    }
  }
}

/// Startup Cost breakdown
class StartupCost extends Equatable {
  final double minimum;
  final double realistic;
  final double optimal;
  final Map<String, double> breakdown;

  const StartupCost({
    required this.minimum,
    required this.realistic,
    required this.optimal,
    required this.breakdown,
  });

  @override
  List<Object?> get props => [minimum, realistic, optimal];
}

/// Market Test Request Entity
class MarketTestRequestEntity extends Equatable {
  final String userId;
  final String? businessId;
  final String ideaDescription;
  final String targetMarket;
  final double? initialInvestment;
  final String currency;
  final String country;
  final String? industry;

  const MarketTestRequestEntity({
    required this.userId,
    this.businessId,
    required this.ideaDescription,
    required this.targetMarket,
    this.initialInvestment,
    required this.currency,
    required this.country,
    this.industry,
  });

  @override
  List<Object?> get props => [
        userId,
        ideaDescription,
        targetMarket,
        currency,
        country,
      ];
}
