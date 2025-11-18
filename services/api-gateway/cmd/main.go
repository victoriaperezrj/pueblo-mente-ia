package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

var (
	httpRequestsTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total number of HTTP requests",
		},
		[]string{"method", "endpoint", "status"},
	)
	httpRequestDuration = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "HTTP request duration in seconds",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"method", "endpoint"},
	)
)

func init() {
	prometheus.MustRegister(httpRequestsTotal)
	prometheus.MustRegister(httpRequestDuration)
}

type HealthResponse struct {
	Status    string    `json:"status"`
	Timestamp time.Time `json:"timestamp"`
	Service   string    `json:"service"`
	Version   string    `json:"version"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
	Code    int    `json:"code"`
}

// Middleware for logging and metrics
func metricsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Create response writer wrapper to capture status code
		rw := &responseWriter{ResponseWriter: w, statusCode: http.StatusOK}

		next.ServeHTTP(rw, r)

		duration := time.Since(start).Seconds()

		httpRequestsTotal.WithLabelValues(r.Method, r.URL.Path, fmt.Sprintf("%d", rw.statusCode)).Inc()
		httpRequestDuration.WithLabelValues(r.Method, r.URL.Path).Observe(duration)

		log.Printf("%s %s %d %v", r.Method, r.URL.Path, rw.statusCode, duration)
	})
}

type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

// Health check endpoint
func healthHandler(w http.ResponseWriter, r *http.Request) {
	response := HealthResponse{
		Status:    "healthy",
		Timestamp: time.Now(),
		Service:   "api-gateway",
		Version:   os.Getenv("SERVICE_VERSION"),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Readiness check endpoint
func readyHandler(w http.ResponseWriter, r *http.Request) {
	// Check dependencies (database, other services, etc.)
	// For now, always return ready
	response := HealthResponse{
		Status:    "ready",
		Timestamp: time.Now(),
		Service:   "api-gateway",
		Version:   os.Getenv("SERVICE_VERSION"),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// API v1 routes
func apiV1Routes(r *mux.Router) {
	v1 := r.PathPrefix("/api/v1").Subrouter()

	// Business endpoints
	v1.HandleFunc("/business/analytics", getBusinessAnalytics).Methods("GET")
	v1.HandleFunc("/business/crm", getCRM).Methods("GET")

	// Entrepreneur endpoints
	v1.HandleFunc("/entrepreneur/validate-idea", validateIdea).Methods("POST")
	v1.HandleFunc("/entrepreneur/financial-simulation", financialSimulation).Methods("POST")

	// PYME endpoints
	v1.HandleFunc("/pyme/team-management", getTeamManagement).Methods("GET")
	v1.HandleFunc("/pyme/strategic-planning", getStrategicPlanning).Methods("GET")
}

func getBusinessAnalytics(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement business analytics
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Business Analytics endpoint"})
}

func getCRM(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement CRM
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "CRM endpoint"})
}

func validateIdea(w http.ResponseWriter, r *http.Request) {
	// TODO: Call AI service for idea validation
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Idea Validation endpoint"})
}

func financialSimulation(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement financial simulation
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Financial Simulation endpoint"})
}

func getTeamManagement(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement team management
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Team Management endpoint"})
}

func getStrategicPlanning(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement strategic planning
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Strategic Planning endpoint"})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := mux.NewRouter()

	// Apply metrics middleware
	r.Use(metricsMiddleware)

	// Health and readiness endpoints
	r.HandleFunc("/health", healthHandler).Methods("GET")
	r.HandleFunc("/ready", readyHandler).Methods("GET")

	// Metrics endpoint for Prometheus
	r.Handle("/metrics", promhttp.Handler())

	// API routes
	apiV1Routes(r)

	// CORS middleware
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	})

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("API Gateway starting on port %s", port)
	if err := server.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
