import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:animate_do/animate_do.dart';
import '../../../core/widgets/custom_text_field.dart';
import '../../../core/widgets/primary_button.dart';
import '../../../core/widgets/score_indicator.dart';
import '../../../domain/entities/market_test_entity.dart';
import '../../bloc/market_test/market_test_bloc.dart';
import '../../bloc/market_test/market_test_event.dart';
import '../../bloc/market_test/market_test_state.dart';
import 'widgets/swot_analysis_card.dart';
import 'widgets/recommendations_card.dart';
import 'widgets/financial_insights_card.dart';

/// Market Test Express Page - Main UI
class MarketTestPage extends StatefulWidget {
  const MarketTestPage({super.key});

  @override
  State<MarketTestPage> createState() => _MarketTestPageState();
}

class _MarketTestPageState extends State<MarketTestPage> {
  final _formKey = GlobalKey<FormState>();
  final _ideaController = TextEditingController();
  final _targetMarketController = TextEditingController();
  final _industryController = TextEditingController();
  final _investmentController = TextEditingController();

  String _selectedCurrency = 'USD';
  String _selectedCountry = 'US';

  MarketTestEntity? _currentResult;

  @override
  void dispose() {
    _ideaController.dispose();
    _targetMarketController.dispose();
    _industryController.dispose();
    _investmentController.dispose();
    super.dispose();
  }

  void _submitForm() {
    if (_formKey.currentState!.validate()) {
      final investment = _investmentController.text.isNotEmpty
          ? double.tryParse(_investmentController.text)
          : null;

      context.read<MarketTestBloc>().add(
            MarketTestEvent.submitMarketTest(
              ideaDescription: _ideaController.text,
              targetMarket: _targetMarketController.text,
              currency: _selectedCurrency,
              country: _selectedCountry,
              industry: _industryController.text.isNotEmpty
                  ? _industryController.text
                  : null,
              initialInvestment: investment,
            ),
          );
    }
  }

  void _resetForm() {
    _ideaController.clear();
    _targetMarketController.clear();
    _industryController.clear();
    _investmentController.clear();
    setState(() {
      _currentResult = null;
    });
    context.read<MarketTestBloc>().add(const MarketTestEvent.reset());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Market Test Express'),
        actions: [
          if (_currentResult != null)
            IconButton(
              icon: const Icon(Icons.refresh),
              onPressed: _resetForm,
              tooltip: 'New Analysis',
            ),
        ],
      ),
      body: BlocConsumer<MarketTestBloc, MarketTestState>(
        listener: (context, state) {
          state.maybeWhen(
            analysisSuccess: (result) {
              setState(() {
                _currentResult = result;
              });
            },
            error: (message, errorCode, isNetworkError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(message),
                  backgroundColor: Colors.red,
                  action: isNetworkError
                      ? SnackBarAction(
                          label: 'Retry',
                          textColor: Colors.white,
                          onPressed: () {
                            context
                                .read<MarketTestBloc>()
                                .add(const MarketTestEvent.retry());
                          },
                        )
                      : null,
                ),
              );
            },
            orElse: () {},
          );
        },
        builder: (context, state) {
          return state.maybeWhen(
            initial: () => _buildForm(),
            analyzing: (message) => _buildLoadingState(message),
            analysisSuccess: (result) => _buildResults(result),
            error: (message, _, isNetworkError) => _buildErrorState(
              message,
              isNetworkError,
            ),
            orElse: () => _buildForm(),
          );
        },
      ),
    );
  }

  /// Build input form
  Widget _buildForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            FadeInDown(
              child: _buildHeader(),
            ),
            const SizedBox(height: 24),
            FadeInLeft(
              delay: const Duration(milliseconds: 100),
              child: CustomTextField(
                controller: _ideaController,
                label: 'Business Idea Description *',
                hint: 'Describe your business idea in detail...',
                maxLines: 5,
                minLines: 3,
                maxLength: 2000,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please describe your business idea';
                  }
                  if (value.trim().length < 10) {
                    return 'Please provide more details (at least 10 characters)';
                  }
                  return null;
                },
              ),
            ),
            const SizedBox(height: 16),
            FadeInLeft(
              delay: const Duration(milliseconds: 200),
              child: CustomTextField(
                controller: _targetMarketController,
                label: 'Target Market *',
                hint: 'Who are your customers? (e.g., Urban professionals aged 25-45)',
                maxLines: 3,
                minLines: 2,
                maxLength: 500,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Please describe your target market';
                  }
                  if (value.trim().length < 3) {
                    return 'Please provide more details';
                  }
                  return null;
                },
              ),
            ),
            const SizedBox(height: 16),
            FadeInLeft(
              delay: const Duration(milliseconds: 300),
              child: CustomTextField(
                controller: _industryController,
                label: 'Industry/Sector',
                hint: 'e.g., Food Tech, E-commerce, SaaS',
                maxLength: 200,
              ),
            ),
            const SizedBox(height: 16),
            FadeInLeft(
              delay: const Duration(milliseconds: 400),
              child: Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: CustomTextField(
                      controller: _investmentController,
                      label: 'Initial Investment',
                      hint: '10000',
                      keyboardType: TextInputType.number,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Currency',
                          style: Theme.of(context).textTheme.labelLarge,
                        ),
                        const SizedBox(height: 8),
                        DropdownButtonFormField<String>(
                          value: _selectedCurrency,
                          items: const [
                            DropdownMenuItem(value: 'USD', child: Text('USD')),
                            DropdownMenuItem(value: 'EUR', child: Text('EUR')),
                            DropdownMenuItem(value: 'GBP', child: Text('GBP')),
                            DropdownMenuItem(value: 'MXN', child: Text('MXN')),
                            DropdownMenuItem(value: 'ARS', child: Text('ARS')),
                          ],
                          onChanged: (value) {
                            if (value != null) {
                              setState(() {
                                _selectedCurrency = value;
                              });
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            FadeInLeft(
              delay: const Duration(milliseconds: 500),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Country/Region',
                    style: Theme.of(context).textTheme.labelLarge,
                  ),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    value: _selectedCountry,
                    isExpanded: true,
                    items: const [
                      DropdownMenuItem(value: 'US', child: Text('United States')),
                      DropdownMenuItem(value: 'GB', child: Text('United Kingdom')),
                      DropdownMenuItem(value: 'MX', child: Text('Mexico')),
                      DropdownMenuItem(value: 'AR', child: Text('Argentina')),
                      DropdownMenuItem(value: 'BR', child: Text('Brazil')),
                      DropdownMenuItem(value: 'ES', child: Text('Spain')),
                    ],
                    onChanged: (value) {
                      if (value != null) {
                        setState(() {
                          _selectedCountry = value;
                        });
                      }
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            FadeInUp(
              delay: const Duration(milliseconds: 600),
              child: PrimaryButton(
                text: 'Analyze Market Viability',
                icon: Icons.analytics,
                onPressed: _submitForm,
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  /// Build header section
  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Theme.of(context).colorScheme.primary,
            Theme.of(context).colorScheme.secondary,
          ],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.lightbulb,
            size: 40,
            color: Colors.white,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'AI-Powered Market Analysis',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Validate your business idea with GPT-4',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.white.withOpacity(0.9),
                      ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Build loading state
  Widget _buildLoadingState(String message) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const CircularProgressIndicator(),
          const SizedBox(height: 24),
          Text(
            message,
            style: Theme.of(context).textTheme.titleMedium,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'This may take 10-30 seconds...',
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ],
      ),
    );
  }

  /// Build error state
  Widget _buildErrorState(String message, bool isNetworkError) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isNetworkError ? Icons.wifi_off : Icons.error_outline,
              size: 64,
              color: Colors.red,
            ),
            const SizedBox(height: 16),
            Text(
              message,
              style: Theme.of(context).textTheme.titleMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            PrimaryButton(
              text: 'Try Again',
              icon: Icons.refresh,
              onPressed: () {
                context.read<MarketTestBloc>().add(const MarketTestEvent.retry());
              },
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: _resetForm,
              child: const Text('Start New Analysis'),
            ),
          ],
        ),
      ),
    );
  }

  /// Build results view
  Widget _buildResults(MarketTestEntity result) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Score Section
          FadeInDown(
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    ScoreIndicator(
                      score: result.viabilityScore,
                      label: 'Viability Score',
                      size: 140,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Market Analysis Results',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Analyzed by ${result.gptModelUsed}',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Market Size & Competition
          FadeInLeft(
            delay: const Duration(milliseconds: 100),
            child: _buildMetricsRow(result),
          ),
          const SizedBox(height: 16),

          // SWOT Analysis
          FadeInLeft(
            delay: const Duration(milliseconds: 200),
            child: SwotAnalysisCard(
              strengths: result.strengths,
              weaknesses: result.weaknesses,
              opportunities: result.opportunities,
              threats: result.threats,
            ),
          ),
          const SizedBox(height: 16),

          // Financial Insights
          if (result.estimatedStartupCost != null)
            FadeInLeft(
              delay: const Duration(milliseconds: 300),
              child: FinancialInsightsCard(
                startupCost: result.estimatedStartupCost!,
                revenuePotential: result.revenuePotential,
                marketSizeUsd: result.estimatedMarketSizeUsd,
                timeToMarket: result.timeToMarket,
              ),
            ),
          const SizedBox(height: 16),

          // Recommendations
          FadeInLeft(
            delay: const Duration(milliseconds: 400),
            child: RecommendationsCard(
              recommendations: result.recommendations,
              nextSteps: result.nextSteps,
            ),
          ),
          const SizedBox(height: 24),

          // Actions
          FadeInUp(
            delay: const Duration(milliseconds: 500),
            child: PrimaryButton(
              text: 'Analyze Another Idea',
              icon: Icons.add,
              onPressed: _resetForm,
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildMetricsRow(MarketTestEntity result) {
    return Row(
      children: [
        Expanded(
          child: _buildMetricCard(
            'Market Size',
            result.marketSize.displayName,
            Icons.public,
            Colors.blue,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildMetricCard(
            'Competition',
            result.competitionLevel.displayName,
            Icons.groups,
            _getCompetitionColor(result.competitionLevel),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildMetricCard(
            'Risk',
            result.riskLevel.displayName,
            Icons.warning,
            _getRiskColor(result.riskLevel),
          ),
        ),
      ],
    );
  }

  Widget _buildMetricCard(String label, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 8),
            Text(
              label,
              style: Theme.of(context).textTheme.bodySmall,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Color _getCompetitionColor(CompetitionLevel level) {
    switch (level) {
      case CompetitionLevel.low:
        return Colors.green;
      case CompetitionLevel.medium:
        return Colors.orange;
      case CompetitionLevel.high:
        return Colors.red;
    }
  }

  Color _getRiskColor(RiskLevel level) {
    switch (level) {
      case RiskLevel.low:
        return Colors.green;
      case RiskLevel.medium:
        return Colors.orange;
      case RiskLevel.high:
        return Colors.red;
    }
  }
}
