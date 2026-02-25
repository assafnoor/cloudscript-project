# CloudScript - DSL for Cloud Microservices

**CloudScript** is a Domain-Specific Language (DSL) designed for defining and deploying microservices in cloud environments. It simplifies the process of creating microservice architectures by providing a clean, declarative syntax that automatically generates deployment configurations, API documentation, and containerization files.

## 🎯 Features

- **Simple Syntax**: Define microservices, endpoints, and connections with minimal boilerplate
- **Multi-Platform**: Generate Docker, Kubernetes, and cloud provider configurations
- **Auto-Documentation**: Automatic OpenAPI/Swagger documentation generation
- **Type-Safe**: Built-in type system for API contracts
- **Protocol Support**: HTTP, gRPC, RabbitMQ, Kafka
- **Database Integration**: PostgreSQL, MongoDB, Redis support
- **Rate Limiting & Caching**: Built-in performance optimizations

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Language Syntax](#language-syntax)
- [Code Generation](#code-generation)
- [Examples](#examples)
- [Architecture](#architecture)
- [Testing](#testing)
- [Contributing](#contributing)

## 🚀 Installation

### Prerequisites

- Python 3.11 or higher
- pip package manager

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/cloudscript.git
cd cloudscript

# Install dependencies
pip install -r requirements.txt

# Add to PATH (optional)
export PATH=$PATH:$(pwd)/src
```

### Dependencies

```bash
pip install pyyaml>=6.0
```

## ⚡ Quick Start

### 1. Create a CloudScript file

Create a file `myservice.cs`:

```cloudscript
service UserService {
    endpoint /users {
        method: GET
        response: User[]
        cache: 5m
        rateLimit: 100/m
    }
    
    endpoint /users/:id {
        method: GET
        response: User
    }
    
    deploy on: docker
    port: 8080
    replicas: 3
}
```

### 2. Compile the service

```bash
python src/cloudscript.py compile myservice.cs
```

### 3. Generated Output

The compiler generates:
- `generated/userservice/Dockerfile`
- `generated/userservice/app.py`
- `generated/userservice/requirements.txt`
- `generated/docker-compose.yml`
- `generated/kubernetes/userservice.yaml`
- `generated/docs/userservice-openapi.json`

### 4. Run the service

```bash
cd generated
docker-compose up
```

Your service is now running at `http://localhost:8080`!

## 📖 Language Syntax

### Service Definition

```cloudscript
service ServiceName {
    // Service configuration
}
```

### Endpoints

```cloudscript
endpoint /path {
    method: GET | POST | PUT | DELETE | PATCH
    response: TypeName | TypeName[]
    cache: 5m | 10s | 1h
    rateLimit: 100/m | 1000/h
    timeout: 3s | 5s
    auth: required | optional | none
    fallback: functionName
}
```

### Path Parameters

```cloudscript
endpoint /users/:id {
    method: GET
    response: User
}
```

### Service Connections

```cloudscript
connect to ServiceName via http | grpc | rabbitmq | kafka
```

### Deployment Configuration

```cloudscript
deploy on: docker | kubernetes | aws | azure | gcp
port: 8080
replicas: 3
```

### Database Configuration

```cloudscript
database postgres {
    host: "localhost"
    port: 5432
}
```

### Types

Built-in types:
- `int` - Integer numbers
- `string` - Text strings
- `bool` - Boolean values
- `float` - Floating-point numbers

Arrays: `Type[]` (e.g., `User[]`)

Custom types are automatically inferred from usage.

## 🔧 Code Generation

### Generate Everything

```bash
python src/cloudscript.py compile myservice.cs
```

### Generate Specific Targets

```bash
# Docker only
python src/cloudscript.py compile myservice.cs --target docker

# Kubernetes only
python src/cloudscript.py compile myservice.cs --target k8s

# API Documentation only
python src/cloudscript.py compile myservice.cs --target openapi
```

### Custom Output Directory

```bash
python src/cloudscript.py compile myservice.cs -o my-output/
```

### Verbose Mode

```bash
python src/cloudscript.py compile myservice.cs -v
```

## 📚 Examples

### Example 1: Simple Blog API

```cloudscript
service BlogService {
    endpoint /posts {
        method: GET
        response: Post[]
        cache: 5m
    }
    
    endpoint /posts/:id {
        method: GET
        response: Post
    }
    
    endpoint /posts {
        method: POST
        response: Post
        auth: required
    }
    
    connect to AuthService via http
    deploy on: docker
    port: 8080
}
```

### Example 2: E-commerce Platform

```cloudscript
service OrderService {
    endpoint /orders {
        method: POST
        response: Order
        auth: required
        timeout: 10s
    }
    
    connect to PaymentService via grpc
    connect to InventoryService via http
    connect to NotificationService via rabbitmq
    
    database postgres {
        host: "localhost"
        port: 5432
    }
    
    deploy on: kubernetes
    port: 8003
    replicas: 5
}
```

More examples in the `examples/` directory.

## 🏗️ Architecture

### Compiler Pipeline

```
Source Code (.cs)
    ↓
Lexical Analysis (Lexer)
    ↓
Tokens
    ↓
Syntax Analysis (Parser)
    ↓
Abstract Syntax Tree (AST)
    ↓
Code Generation
    ├── Docker Generator
    ├── Kubernetes Generator
    └── OpenAPI Generator
    ↓
Generated Files
```

### Project Structure

```
cloudscript-project/
├── src/
│   ├── lexer.py              # Tokenizer
│   ├── parser.py             # Syntax analyzer
│   ├── ast_nodes.py          # AST definitions
│   ├── docker_generator.py   # Docker file generator
│   ├── kubernetes_generator.py # K8s manifest generator
│   ├── openapi_generator.py  # API docs generator
│   └── cloudscript.py        # Main compiler
├── examples/
│   ├── blog.cs
│   └── ecommerce.cs
├── tests/
│   └── test_all.py
├── docs/
│   └── GRAMMAR.md
└── generated/                # Output directory
```

## 🧪 Testing

### Run All Tests

```bash
cd tests
python test_all.py
```

### Test Coverage

- Lexer tests: Token recognition, paths, durations
- Parser tests: Service parsing, endpoints, connections
- Generator tests: Docker, Kubernetes, OpenAPI output
- End-to-end tests: Full compilation pipeline

### Run Specific Test

```bash
python -m unittest tests.test_all.TestLexer
```

## 📊 Generated Outputs

### Docker Files

- **Dockerfile**: Containerization instructions
- **docker-compose.yml**: Multi-service orchestration
- **requirements.txt**: Python dependencies
- **app.py**: FastAPI application skeleton

### Kubernetes Manifests

- **Deployment**: Pod specifications and replicas
- **Service**: Internal networking
- **Ingress**: External access configuration
- **HorizontalPodAutoscaler**: Auto-scaling rules
- **ConfigMap**: Environment configuration

### API Documentation

- **OpenAPI JSON**: Complete API specification
- **Swagger UI HTML**: Interactive documentation
- Request/response schemas
- Authentication requirements
- Rate limits and caching info

## 🎓 Educational Use

This project is designed for academic coursework in:
- Compiler design
- Domain-specific languages
- Cloud computing
- Microservices architecture

### Key Learning Outcomes

1. **Language Design**: BNF grammar, syntax design
2. **Lexical Analysis**: Tokenization, pattern matching
3. **Syntax Analysis**: Parsing, AST construction
4. **Code Generation**: Template-based generation
5. **Cloud Deployment**: Docker, Kubernetes concepts

## 🔍 Grammar Specification

See `docs/GRAMMAR.md` for complete BNF grammar.

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional cloud platforms (AWS Lambda, Azure Functions)
- More protocols (WebSocket, GraphQL)
- Advanced features (circuit breakers, service mesh)
- IDE plugins (VS Code, IntelliJ)
- Performance optimizations

## 📝 License

MIT License - see LICENSE file for details

## 👥 Authors

- Your Name - Initial work
- University Name
- Course: Theory of Programming Languages

## 🙏 Acknowledgments

- Inspired by modern microservice frameworks
- Built for educational purposes
- Special thanks to course instructors

## 🗺️ Roadmap

- [ ] GraphQL support
- [ ] Service mesh integration
- [ ] CI/CD pipeline generation
- [ ] Monitoring and observability configs
- [ ] Language server protocol support
- [ ] VS Code extension

---

**CloudScript** - Simplifying microservice development, one declaration at a time.
