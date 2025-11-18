# 📱 MARKET TEST - MOBILE IMPLEMENTATION
## Feature Completa con BLoC Pattern + Clean Architecture

---

## 🏗️ ARQUITECTURA (Clean Architecture)

```
features/validation/market_test/
├── data/
│   ├── models/
│   │   ├── market_test_request_model.dart
│   │   ├── market_test_response_model.dart
│   │   └── answer_model.dart
│   ├── repositories/
│   │   └── market_test_repository_impl.dart
│   └── datasources/
│       ├── market_test_remote_datasource.dart
│       └── market_test_local_datasource.dart
├── domain/
│   ├── entities/
│   │   ├── market_test.dart
│   │   └── answer.dart
│   ├── repositories/
│   │   └── market_test_repository.dart
│   └── usecases/
│       ├── submit_market_test.dart
│       └── get_test_history.dart
└── presentation/
    ├── pages/
    │   ├── market_test_page.dart
    │   └── market_test_results_page.dart
    ├── widgets/
    │   ├── question_card.dart
    │   ├── progress_indicator.dart
    │   ├── score_gauge.dart
    │   └── insights_list.dart
    └── bloc/
        ├── market_test_bloc.dart
        ├── market_test_event.dart
        └── market_test_state.dart
```

---

## 📦 DATA LAYER

### **Model (Freezed + JSON Serializable)**

**lib/features/validation/market_test/data/models/answer_model.dart:**
```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'answer_model.freezed.dart';
part 'answer_model.g.dart';

@freezed
class AnswerModel with _$AnswerModel {
  const factory AnswerModel({
    required String questionId,
    required String questionText,
    required String answer,
    @Default(0.8) double confidence,
  }) = _AnswerModel;

  factory AnswerModel.fromJson(Map<String, dynamic> json) =>
      _$AnswerModelFromJson(json);
}
```

**lib/features/validation/market_test/data/models/market_test_response_model.dart:**
```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'market_test_response_model.freezed.dart';
part 'market_test_response_model.g.dart';

@freezed
class MarketTestResponseModel with _$MarketTestResponseModel {
  const factory MarketTestResponseModel({
    required int marketFitScore,
    required Map<String, int> breakdown,
    required List<String> insights,
    required List<String> recommendations,
    required List<NextStep> nextSteps,
  }) = _MarketTestResponseModel;

  factory MarketTestResponseModel.fromJson(Map<String, dynamic> json) =>
      _$MarketTestResponseModelFromJson(json);
}

@freezed
class NextStep with _$NextStep {
  const factory NextStep({
    required String action,
    required String priority,
    required String estimatedTime,
    required List<String> resources,
  }) = _NextStep;

  factory NextStep.fromJson(Map<String, dynamic> json) =>
      _$NextStepFromJson(json);
}

@freezed
class ScoreBreakdown with _$ScoreBreakdown {
  const factory ScoreBreakdown({
    required int problemClarity,
    required int targetMarketUnderstanding,
    required int competitiveAdvantage,
    required int customerValidation,
    required int monetizationStrategy,
  }) = _ScoreBreakdown;

  factory ScoreBreakdown.fromJson(Map<String, dynamic> json) =>
      _$ScoreBreakdownFromJson(json);
}
```

### **Remote Data Source (Retrofit)**

**lib/features/validation/market_test/data/datasources/market_test_remote_datasource.dart:**
```dart
import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/data/models/market_test_request_model.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/data/models/market_test_response_model.dart';

part 'market_test_remote_datasource.g.dart';

@RestApi()
abstract class MarketTestRemoteDataSource {
  factory MarketTestRemoteDataSource(Dio dio, {String baseUrl}) =
      _MarketTestRemoteDataSource;

  @POST('/api/v1/validation/market-test')
  Future<MarketTestResponseModel> submitTest(
    @Body() MarketTestRequestModel request,
  );

  @GET('/api/v1/validation/market-test/history')
  Future<List<MarketTestResponseModel>> getTestHistory(
    @Query('user_id') String userId,
  );
}
```

### **Repository Implementation**

**lib/features/validation/market_test/data/repositories/market_test_repository_impl.dart:**
```dart
import 'package:dartz/dartz.dart';
import 'package:pueblo_mente_mobile/core/error/failures.dart';
import 'package:pueblo_mente_mobile/core/network/network_info.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/data/datasources/market_test_remote_datasource.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/data/datasources/market_test_local_datasource.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/data/models/market_test_request_model.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/domain/entities/market_test.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/domain/repositories/market_test_repository.dart';

class MarketTestRepositoryImpl implements MarketTestRepository {
  final MarketTestRemoteDataSource remoteDataSource;
  final MarketTestLocalDataSource localDataSource;
  final NetworkInfo networkInfo;

  MarketTestRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
  });

  @override
  Future<Either<Failure, MarketTest>> submitTest(
    MarketTestRequest request,
  ) async {
    if (await networkInfo.isConnected) {
      try {
        final requestModel = MarketTestRequestModel(
          userId: request.userId,
          businessId: request.businessId,
          answers: request.answers
              .map((a) => AnswerModel(
                    questionId: a.questionId,
                    questionText: a.questionText,
                    answer: a.answer,
                    confidence: a.confidence,
                  ))
              .toList(),
        );

        final response = await remoteDataSource.submitTest(requestModel);

        // Cache result locally
        await localDataSource.cacheTestResult(response);

        return Right(response.toEntity());
      } catch (e) {
        return Left(ServerFailure(message: e.toString()));
      }
    } else {
      return Left(NetworkFailure());
    }
  }

  @override
  Future<Either<Failure, List<MarketTest>>> getTestHistory(
    String userId,
  ) async {
    try {
      // Try to get from cache first
      final cachedHistory = await localDataSource.getTestHistory(userId);
      if (cachedHistory.isNotEmpty) {
        return Right(cachedHistory.map((m) => m.toEntity()).toList());
      }

      // If no cache, fetch from server
      if (await networkInfo.isConnected) {
        final history = await remoteDataSource.getTestHistory(userId);
        await localDataSource.cacheTestHistory(history);
        return Right(history.map((m) => m.toEntity()).toList());
      } else {
        return Left(NetworkFailure());
      }
    } catch (e) {
      return Left(CacheFailure());
    }
  }
}

// Extension to convert model to entity
extension MarketTestResponseModelX on MarketTestResponseModel {
  MarketTest toEntity() {
    return MarketTest(
      marketFitScore: marketFitScore,
      breakdown: breakdown,
      insights: insights,
      recommendations: recommendations,
      nextSteps: nextSteps
          .map((ns) => NextStepEntity(
                action: ns.action,
                priority: ns.priority,
                estimatedTime: ns.estimatedTime,
                resources: ns.resources,
              ))
          .toList(),
    );
  }
}
```

---

## 🎯 DOMAIN LAYER

### **Entities**

**lib/features/validation/market_test/domain/entities/market_test.dart:**
```dart
import 'package:equatable/equatable.dart';

class MarketTest extends Equatable {
  final int marketFitScore;
  final Map<String, int> breakdown;
  final List<String> insights;
  final List<String> recommendations;
  final List<NextStepEntity> nextSteps;

  const MarketTest({
    required this.marketFitScore,
    required this.breakdown,
    required this.insights,
    required this.recommendations,
    required this.nextSteps,
  });

  @override
  List<Object?> get props => [
        marketFitScore,
        breakdown,
        insights,
        recommendations,
        nextSteps,
      ];
}

class NextStepEntity extends Equatable {
  final String action;
  final String priority;
  final String estimatedTime;
  final List<String> resources;

  const NextStepEntity({
    required this.action,
    required this.priority,
    required this.estimatedTime,
    required this.resources,
  });

  @override
  List<Object?> get props => [action, priority, estimatedTime, resources];
}

class Answer extends Equatable {
  final String questionId;
  final String questionText;
  final String answer;
  final double confidence;

  const Answer({
    required this.questionId,
    required this.questionText,
    required this.answer,
    this.confidence = 0.8,
  });

  @override
  List<Object?> get props => [questionId, questionText, answer, confidence];
}

class MarketTestRequest extends Equatable {
  final String userId;
  final String? businessId;
  final List<Answer> answers;

  const MarketTestRequest({
    required this.userId,
    this.businessId,
    required this.answers,
  });

  @override
  List<Object?> get props => [userId, businessId, answers];
}
```

### **Repository Interface**

**lib/features/validation/market_test/domain/repositories/market_test_repository.dart:**
```dart
import 'package:dartz/dartz.dart';
import 'package:pueblo_mente_mobile/core/error/failures.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/domain/entities/market_test.dart';

abstract class MarketTestRepository {
  Future<Either<Failure, MarketTest>> submitTest(MarketTestRequest request);
  Future<Either<Failure, List<MarketTest>>> getTestHistory(String userId);
}
```

### **Use Cases**

**lib/features/validation/market_test/domain/usecases/submit_market_test.dart:**
```dart
import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import 'package:pueblo_mente_mobile/core/error/failures.dart';
import 'package:pueblo_mente_mobile/core/usecases/usecase.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/domain/entities/market_test.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/domain/repositories/market_test_repository.dart';

class SubmitMarketTest implements UseCase<MarketTest, SubmitMarketTestParams> {
  final MarketTestRepository repository;

  SubmitMarketTest(this.repository);

  @override
  Future<Either<Failure, MarketTest>> call(
    SubmitMarketTestParams params,
  ) async {
    return await repository.submitTest(params.request);
  }
}

class SubmitMarketTestParams extends Equatable {
  final MarketTestRequest request;

  const SubmitMarketTestParams({required this.request});

  @override
  List<Object?> get props => [request];
}
```

---

## 🎨 PRESENTATION LAYER

### **BLoC (State Management)**

**lib/features/validation/market_test/presentation/bloc/market_test_event.dart:**
```dart
part of 'market_test_bloc.dart';

abstract class MarketTestEvent extends Equatable {
  const MarketTestEvent();

  @override
  List<Object?> get props => [];
}

class SubmitTestEvent extends MarketTestEvent {
  final MarketTestRequest request;

  const SubmitTestEvent(this.request);

  @override
  List<Object?> get props => [request];
}

class LoadTestHistoryEvent extends MarketTestEvent {
  final String userId;

  const LoadTestHistoryEvent(this.userId);

  @override
  List<Object?> get props => [userId];
}

class AnswerQuestionEvent extends MarketTestEvent {
  final Answer answer;

  const AnswerQuestionEvent(this.answer);

  @override
  List<Object?> get props => [answer];
}

class NextQuestionEvent extends MarketTestEvent {}

class PreviousQuestionEvent extends MarketTestEvent {}
```

**lib/features/validation/market_test/presentation/bloc/market_test_state.dart:**
```dart
part of 'market_test_bloc.dart';

abstract class MarketTestState extends Equatable {
  const MarketTestState();

  @override
  List<Object?> get props => [];
}

class MarketTestInitial extends MarketTestState {}

class MarketTestLoading extends MarketTestState {}

class MarketTestInProgress extends MarketTestState {
  final int currentQuestionIndex;
  final List<Answer> answers;
  final List<Question> questions;

  const MarketTestInProgress({
    required this.currentQuestionIndex,
    required this.answers,
    required this.questions,
  });

  double get progress => (currentQuestionIndex + 1) / questions.length;

  @override
  List<Object?> get props => [currentQuestionIndex, answers, questions];
}

class MarketTestSuccess extends MarketTestState {
  final MarketTest result;

  const MarketTestSuccess(this.result);

  @override
  List<Object?> get props => [result];
}

class MarketTestFailure extends MarketTestState {
  final String message;

  const MarketTestFailure(this.message);

  @override
  List<Object?> get props => [message];
}

class TestHistoryLoaded extends MarketTestState {
  final List<MarketTest> history;

  const TestHistoryLoaded(this.history);

  @override
  List<Object?> get props => [history];
}
```

**lib/features/validation/market_test/presentation/bloc/market_test_bloc.dart:**
```dart
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/domain/entities/market_test.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/domain/usecases/submit_market_test.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/domain/usecases/get_test_history.dart';

part 'market_test_event.dart';
part 'market_test_state.dart';

class MarketTestBloc extends Bloc<MarketTestEvent, MarketTestState> {
  final SubmitMarketTest submitTest;
  final GetTestHistory getHistory;

  List<Answer> _currentAnswers = [];
  int _currentQuestionIndex = 0;

  static final List<Question> _questions = [
    const Question(
      id: 'q1',
      text: '¿Qué problema específico resuelve tu producto o servicio?',
      type: QuestionType.text,
    ),
    const Question(
      id: 'q2',
      text: '¿Quién es tu cliente ideal? Describe demographics y comportamientos.',
      type: QuestionType.text,
    ),
    const Question(
      id: 'q3',
      text: '¿Cómo resuelven este problema actualmente tus clientes potenciales?',
      type: QuestionType.text,
    ),
    const Question(
      id: 'q4',
      text: '¿Cuánto estarían dispuestos a pagar mensualmente?',
      type: QuestionType.scale,
      options: ['\$0-50', '\$50-200', '\$200-500', '\$500-1000', '\$1000+'],
    ),
    const Question(
      id: 'q5',
      text: '¿Cuántos competidores directos has identificado?',
      type: QuestionType.scale,
      options: ['0', '1-3', '4-10', '10+'],
    ),
    const Question(
      id: 'q6',
      text: '¿Qué hace única a tu solución vs. competidores?',
      type: QuestionType.text,
    ),
    const Question(
      id: 'q7',
      text: '¿Ya hablaste con al menos 10 clientes potenciales?',
      type: QuestionType.scale,
      options: ['No, ninguno', '1-5', '6-10', '10-20', '20+'],
    ),
    const Question(
      id: 'q8',
      text: '¿Tienes early adopters o beta users comprometidos?',
      type: QuestionType.scale,
      options: ['No', 'Sí, 1-5', 'Sí, 5-10', 'Sí, 10+'],
    ),
    const Question(
      id: 'q9',
      text: '¿Cuál es tu plan de adquisición de los primeros 100 clientes?',
      type: QuestionType.text,
    ),
    const Question(
      id: 'q10',
      text: '¿Por qué crees que AHORA es el momento correcto para lanzar esto?',
      type: QuestionType.text,
    ),
  ];

  MarketTestBloc({
    required this.submitTest,
    required this.getHistory,
  }) : super(MarketTestInitial()) {
    on<SubmitTestEvent>(_onSubmitTest);
    on<LoadTestHistoryEvent>(_onLoadTestHistory);
    on<AnswerQuestionEvent>(_onAnswerQuestion);
    on<NextQuestionEvent>(_onNextQuestion);
    on<PreviousQuestionEvent>(_onPreviousQuestion);

    // Start with first question
    emit(MarketTestInProgress(
      currentQuestionIndex: 0,
      answers: [],
      questions: _questions,
    ));
  }

  Future<void> _onSubmitTest(
    SubmitTestEvent event,
    Emitter<MarketTestState> emit,
  ) async {
    emit(MarketTestLoading());

    final result = await submitTest(
      SubmitMarketTestParams(request: event.request),
    );

    result.fold(
      (failure) => emit(MarketTestFailure(failure.message)),
      (marketTest) => emit(MarketTestSuccess(marketTest)),
    );
  }

  Future<void> _onLoadTestHistory(
    LoadTestHistoryEvent event,
    Emitter<MarketTestState> emit,
  ) async {
    emit(MarketTestLoading());

    final result = await getHistory(GetTestHistoryParams(userId: event.userId));

    result.fold(
      (failure) => emit(MarketTestFailure(failure.message)),
      (history) => emit(TestHistoryLoaded(history)),
    );
  }

  void _onAnswerQuestion(
    AnswerQuestionEvent event,
    Emitter<MarketTestState> emit,
  ) {
    // Update or add answer
    final existingIndex = _currentAnswers.indexWhere(
      (a) => a.questionId == event.answer.questionId,
    );

    if (existingIndex != -1) {
      _currentAnswers[existingIndex] = event.answer;
    } else {
      _currentAnswers.add(event.answer);
    }

    emit(MarketTestInProgress(
      currentQuestionIndex: _currentQuestionIndex,
      answers: List.from(_currentAnswers),
      questions: _questions,
    ));
  }

  void _onNextQuestion(
    NextQuestionEvent event,
    Emitter<MarketTestState> emit,
  ) {
    if (_currentQuestionIndex < _questions.length - 1) {
      _currentQuestionIndex++;
      emit(MarketTestInProgress(
        currentQuestionIndex: _currentQuestionIndex,
        answers: _currentAnswers,
        questions: _questions,
      ));
    } else {
      // Submit test
      final request = MarketTestRequest(
        userId: 'current-user-id', // Get from auth
        answers: _currentAnswers,
      );
      add(SubmitTestEvent(request));
    }
  }

  void _onPreviousQuestion(
    PreviousQuestionEvent event,
    Emitter<MarketTestState> emit,
  ) {
    if (_currentQuestionIndex > 0) {
      _currentQuestionIndex--;
      emit(MarketTestInProgress(
        currentQuestionIndex: _currentQuestionIndex,
        answers: _currentAnswers,
        questions: _questions,
      ));
    }
  }
}

enum QuestionType { text, scale, multiselect }

class Question extends Equatable {
  final String id;
  final String text;
  final QuestionType type;
  final List<String>? options;

  const Question({
    required this.id,
    required this.text,
    required this.type,
    this.options,
  });

  @override
  List<Object?> get props => [id, text, type, options];
}
```

### **UI Page**

**lib/features/validation/market_test/presentation/pages/market_test_page.dart:**
```dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/presentation/bloc/market_test_bloc.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/presentation/widgets/question_card.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/presentation/widgets/progress_indicator.dart';
import 'package:pueblo_mente_mobile/features/validation/market_test/presentation/pages/market_test_results_page.dart';
import 'package:pueblo_mente_mobile/shared/widgets/buttons/primary_button.dart';

class MarketTestPage extends StatelessWidget {
  const MarketTestPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Test de Mercado Express'),
        centerTitle: true,
      ),
      body: BlocConsumer<MarketTestBloc, MarketTestState>(
        listener: (context, state) {
          if (state is MarketTestSuccess) {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (_) => MarketTestResultsPage(result: state.result),
              ),
            );
          } else if (state is MarketTestFailure) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
          }
        },
        builder: (context, state) {
          if (state is MarketTestLoading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          if (state is MarketTestInProgress) {
            return _buildTestInProgress(context, state);
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildTestInProgress(
    BuildContext context,
    MarketTestInProgress state,
  ) {
    final currentQuestion = state.questions[state.currentQuestionIndex];
    final currentAnswer = state.answers.firstWhere(
      (a) => a.questionId == currentQuestion.id,
      orElse: () => Answer(
        questionId: currentQuestion.id,
        questionText: currentQuestion.text,
        answer: '',
      ),
    );

    return Column(
      children: [
        // Progress Bar
        MarketTestProgressIndicator(progress: state.progress),

        // Question Card
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: QuestionCard(
              question: currentQuestion,
              answer: currentAnswer,
              onAnswerChanged: (answer) {
                context.read<MarketTestBloc>().add(
                      AnswerQuestionEvent(answer),
                    );
              },
            ),
          ),
        ),

        // Navigation Buttons
        Padding(
          padding: const EdgeInsets.all(24),
          child: Row(
            children: [
              if (state.currentQuestionIndex > 0)
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      context.read<MarketTestBloc>().add(PreviousQuestionEvent());
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: const Text('Anterior'),
                  ),
                ),
              if (state.currentQuestionIndex > 0) const SizedBox(width: 16),
              Expanded(
                child: PrimaryButton(
                  text: state.currentQuestionIndex == state.questions.length - 1
                      ? 'Ver Resultados'
                      : 'Siguiente',
                  onPressed: currentAnswer.answer.isNotEmpty
                      ? () {
                          context.read<MarketTestBloc>().add(NextQuestionEvent());
                        }
                      : null,
                  isDisabled: currentAnswer.answer.isEmpty,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
```

*Continuaré con más ejemplos en el siguiente commit...*
