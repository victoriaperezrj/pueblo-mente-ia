# 🏢 Pueblo Mente IA - Enterprise Architecture

## 🎯 Arquitectura de Microservicios de Nivel Enterprise

Esta es la arquitectura empresarial completa de Pueblo Mente IA, diseñada para escalar de 10 a 10,000+ usuarios con alta disponibilidad, observabilidad total y seguridad de nivel enterprise.

---

## 📐 Stack Tecnológico Enterprise

### **Backend - Microservicios**
| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| **API Gateway** | Go (Golang) | Alta concurrencia, baja latencia |
| **AI Service** | Python + FastAPI | Lógica de IA/ML, integración con LLMs |
| **Auth Service** | Go + JWT | Autenticación y autorización |
| **User Service** | Go | Gestión de usuarios |
| **Analytics Service** | Python | Análisis de datos y métricas |

### **Frontend**
| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| **Web App** | Next.js (React) | SEO, SSR, performance |
| **Mobile** | React Native (futuro) | Apps nativas iOS/Android |

### **Infraestructura Cloud - GCP**
| Componente | Servicio GCP | Propósito |
|------------|--------------|-----------|
| **Compute** | GKE (Google Kubernetes Engine) | Orquestación de contenedores |
| **AI/ML** | Vertex AI | Entrenamiento y deployment de modelos |
| **LLMs** | Gemini API | Generación de texto con IA |
| **Storage** | Cloud Storage | Archivos y backups |
| **CDN** | Cloud CDN | Distribución global de contenido |

### **Bases de Datos**
| Tipo | Tecnología | Uso |
|------|------------|-----|
| **Transaccional** | PostgreSQL (Cloud SQL) | Datos de usuarios, transacciones |
| **Vectorial** | Milvus / Pinecone | Embeddings para RAG, búsqueda semántica |
| **Cache** | Redis (Memorystore) | Sesiones, cache de queries |

### **Mensajería & Eventos**
| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| **Event Streaming** | Apache Kafka | Eventos en tiempo real, logs |
| **Pub/Sub** | Google Pub/Sub | Mensajería asíncrona |

### **Service Mesh & Networking**
| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| **Service Mesh** | Istio | mTLS, observabilidad, traffic management |
| **Ingress** | Istio Gateway | Punto de entrada HTTPS |
| **DNS** | Cloud DNS | Resolución de dominios |

### **Observabilidad**
| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| **Metrics** | Prometheus | Métricas de sistemas y apps |
| **Visualization** | Grafana | Dashboards y alertas |
| **Logging** | Cloud Logging | Logs centralizados |
| **Tracing** | Cloud Trace | Distributed tracing |
| **APM** | Sentry (opcional) | Error tracking |

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET (HTTPS)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Cloud CDN     │
                    │  Load Balancer  │
                    └────────┬────────┘
                             │
                  ┌──────────▼──────────┐
                  │   Istio Gateway     │
                  │  (mTLS, Security)   │
                  └──────────┬──────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼─────┐      ┌──────▼──────┐      ┌─────▼────┐
   │   API    │      │     AI      │      │   Auth   │
   │ Gateway  │◄────►│   Service   │      │ Service  │
   │   (Go)   │      │  (Python)   │      │   (Go)   │
   └────┬─────┘      └──────┬──────┘      └─────┬────┘
        │                   │                    │
        └───────────┬───────┴────────────────────┘
                    │
        ┌───────────▼───────────┐
        │   Apache Kafka        │
        │  (Event Streaming)    │
        └───────────┬───────────┘
                    │
        ┌───────────┴────────────────────────┐
        │                                    │
   ┌────▼──────┐                    ┌───────▼────────┐
   │PostgreSQL │                    │     Milvus     │
   │ (Cloud SQL)│                    │ (Vector DB)    │
   └───────────┘                    └────────────────┘
```

---

## 🚀 Deployment

### **Opción 1: Desarrollo Local con Docker Compose**

```bash
# Levantar toda la infraestructura enterprise local
docker-compose -f docker-compose.enterprise.yml up

# Servicios disponibles:
# - API Gateway: http://localhost:8080
# - AI Service: http://localhost:8000
# - PostgreSQL: localhost:5432
# - Kafka: localhost:9092
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3001
```

### **Opción 2: Deploy en GKE (Google Kubernetes Engine)**

#### **Pre-requisitos:**
```bash
# 1. Instalar gcloud CLI
curl https://sdk.cloud.google.com | bash

# 2. Autenticar
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 3. Crear cluster GKE
gcloud container clusters create pueblo-mente-cluster \
  --zone=us-central1-a \
  --num-nodes=3 \
  --machine-type=n1-standard-2 \
  --enable-autoscaling \
  --min-nodes=3 \
  --max-nodes=10

# 4. Configurar kubectl
gcloud container clusters get-credentials pueblo-mente-cluster --zone=us-central1-a
```

#### **Deploy de Istio:**
```bash
# Instalar Istio
curl -L https://istio.io/downloadIstio | sh -
cd istio-*
export PATH=$PWD/bin:$PATH

# Instalar en el cluster
istioctl install --set profile=production -y

# Habilitar inyección automática de sidecar
kubectl label namespace pueblo-mente istio-injection=enabled
```

#### **Deploy de aplicaciones:**
```bash
# 1. Crear namespace
kubectl apply -f infrastructure/kubernetes/namespace.yaml

# 2. Deploy de bases de datos
kubectl apply -f infrastructure/kubernetes/postgresql.yaml
kubectl apply -f infrastructure/kubernetes/milvus.yaml

# 3. Deploy de Kafka
kubectl apply -f infrastructure/kafka/kafka-deployment.yaml

# 4. Deploy de microservicios
kubectl apply -f infrastructure/kubernetes/api-gateway-deployment.yaml
kubectl apply -f infrastructure/kubernetes/ai-service-deployment.yaml

# 5. Configurar Istio
kubectl apply -f infrastructure/istio/gateway.yaml
kubectl apply -f infrastructure/istio/destination-rules.yaml

# 6. Deploy de observabilidad
kubectl apply -f infrastructure/prometheus/prometheus-config.yaml
kubectl apply -f infrastructure/prometheus/grafana-deployment.yaml
```

#### **Verificar deployment:**
```bash
# Ver todos los pods
kubectl get pods -n pueblo-mente

# Ver servicios
kubectl get svc -n pueblo-mente

# Ver logs de un servicio
kubectl logs -f deployment/api-gateway -n pueblo-mente

# Ver métricas en tiempo real
kubectl top pods -n pueblo-mente
```

---

## 📊 Observabilidad & Monitoring

### **Acceder a Dashboards:**

**Grafana:**
```bash
kubectl port-forward -n pueblo-mente svc/grafana 3000:80
# Abrir http://localhost:3000
# User: admin / Pass: admin
```

**Prometheus:**
```bash
kubectl port-forward -n pueblo-mente svc/prometheus 9090:9090
# Abrir http://localhost:9090
```

**Istio Dashboard:**
```bash
istioctl dashboard kiali
```

### **Métricas Clave a Monitorear:**

1. **Request Rate (RPS)**: Requests por segundo
2. **Error Rate**: % de errores 4xx/5xx
3. **Latency**: p50, p95, p99
4. **Saturation**: CPU, Memory, Disk I/O
5. **Traffic Distribution**: Entre microservicios

---

## 🔒 Seguridad

### **mTLS (Mutual TLS)**
Istio habilita automáticamente mTLS entre todos los servicios:
- Cifrado end-to-end
- Autenticación mutua
- Rotación automática de certificados

### **Secrets Management**
```bash
# Crear secrets para APIs
kubectl create secret generic ai-secrets \
  --from-literal=openai-api-key=YOUR_OPENAI_KEY \
  --from-literal=gemini-api-key=YOUR_GEMINI_KEY \
  -n pueblo-mente
```

---

## 🔧 Troubleshooting

### **Logs de servicios:**
```bash
# Ver logs de API Gateway
kubectl logs -f deployment/api-gateway -n pueblo-mente

# Ver logs de AI Service
kubectl logs -f deployment/ai-service -n pueblo-mente

# Ver logs de Istio sidecar
kubectl logs -f deployment/api-gateway -c istio-proxy -n pueblo-mente
```

### **Debugging de red:**
```bash
# Ejecutar shell en un pod
kubectl exec -it deployment/api-gateway -n pueblo-mente -- /bin/sh

# Test de conectividad
kubectl run -it --rm debug --image=nicolaka/netshoot --restart=Never -- bash
```

---

## 📈 Escalamiento

### **Horizontal Pod Autoscaler (HPA)**
Ya configurado en los manifiestos. Escala automáticamente basado en:
- CPU > 70%
- Memory > 80%

### **Cluster Autoscaler**
GKE escala automáticamente los nodos del cluster.

### **Vertical Pod Autoscaler (VPA)**
```bash
# Instalar VPA
kubectl apply -f https://github.com/kubernetes/autoscaler/releases/download/vertical-pod-autoscaler-0.13.0/vpa-crd.yaml
kubectl apply -f https://github.com/kubernetes/autoscaler/releases/download/vertical-pod-autoscaler-0.13.0/vpa-rbac.yaml
kubectl apply -f https://github.com/kubernetes/autoscaler/releases/download/vertical-pod-autoscaler-0.13.0/vpa.yaml
```

---

## 🎯 Roadmap Técnico

- [ ] **Q1 2025**: Deploy completo en GKE
- [ ] **Q2 2025**: Integración con Vertex AI para fine-tuning de modelos
- [ ] **Q3 2025**: Multi-región con Cloud CDN
- [ ] **Q4 2025**: Implementación de Chaos Engineering con Gremlin

---

## 👥 Equipo Recomendado

Para operar esta arquitectura se recomienda:
- **1 DevOps Engineer**: Kubernetes, Istio, GCP
- **2 Backend Engineers**: Go, Python
- **1 Frontend Engineer**: Next.js, React
- **1 ML Engineer**: MLOps, Vertex AI
- **1 SRE**: Monitoring, Incidents

---

## 📚 Referencias

- [Istio Documentation](https://istio.io/latest/docs/)
- [GKE Best Practices](https://cloud.google.com/kubernetes-engine/docs/best-practices)
- [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator)
- [Apache Kafka on Kubernetes](https://strimzi.io/)

---

**Mantenido por**: Equipo DevOps Pueblo Mente IA  
**Última actualización**: Nov 2025
