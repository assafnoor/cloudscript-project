// E-commerce Microservices Architecture
// Example 1: Complete online shopping system

service UserService {
    endpoint /users {
        method: GET
        response: User[]
        cache: 5m
        rateLimit: 100/m
        auth: required
    }
    
    endpoint /users/:id {
        method: GET
        response: User
        cache: 2m
        timeout: 3s
    }
    
    endpoint /users {
        method: POST
        response: User
        auth: required
    }
    
    endpoint /users/:id {
        method: PUT
        response: User
        auth: required
    }
    
    deploy on: kubernetes
    port: 8001
    replicas: 3
    
    database postgres {
        host: "localhost"
        port: 5432
    }
}

service ProductService {
    endpoint /products {
        method: GET
        response: Product[]
        cache: 10m
        rateLimit: 200/m
    }
    
    endpoint /products/:id {
        method: GET
        response: Product
        cache: 15m
        timeout: 2s
    }
    
    endpoint /products/search {
        method: GET
        response: Product[]
        cache: 5m
    }
    
    endpoint /products {
        method: POST
        response: Product
        auth: required
    }
    
    connect to InventoryService via http
    
    deploy on: kubernetes
    port: 8002
    replicas: 5
    
    database mongodb {
        host: "localhost"
        port: 27017
    }
}

service OrderService {
    endpoint /orders {
        method: GET
        response: Order[]
        auth: required
        rateLimit: 50/m
    }
    
    endpoint /orders/:id {
        method: GET
        response: Order
        auth: required
        timeout: 5s
    }
    
    endpoint /orders {
        method: POST
        response: Order
        auth: required
        timeout: 10s
    }
    
    endpoint /orders/:id/cancel {
        method: POST
        response: Order
        auth: required
    }
    
    connect to UserService via http
    connect to ProductService via http
    connect to PaymentService via grpc
    connect to InventoryService via http
    connect to NotificationService via rabbitmq
    
    deploy on: kubernetes
    port: 8003
    replicas: 5
    
    database postgres {
        host: "localhost"
        port: 5432
    }
}

service PaymentService {
    endpoint /payments {
        method: POST
        response: Payment
        auth: required
        timeout: 15s
    }
    
    endpoint /payments/:id {
        method: GET
        response: Payment
        auth: required
    }
    
    endpoint /payments/:id/refund {
        method: POST
        response: Payment
        auth: required
    }
    
    connect to BankAPI via http
    
    deploy on: kubernetes
    port: 8004
    replicas: 3
    
    database postgres {
        host: "localhost"
        port: 5432
    }
}

service InventoryService {
    endpoint /inventory/:productId {
        method: GET
        response: Inventory
        cache: 1m
    }
    
    endpoint /inventory/:productId/reserve {
        method: POST
        response: bool
        timeout: 5s
    }
    
    endpoint /inventory/:productId/release {
        method: POST
        response: bool
    }
    
    deploy on: kubernetes
    port: 8005
    replicas: 3
    
    database redis {
        host: "localhost"
        port: 6379
    }
}

service NotificationService {
    endpoint /notifications/send {
        method: POST
        response: bool
    }
    
    connect to EmailService via http
    connect to SMSService via http
    
    deploy on: kubernetes
    port: 8006
    replicas: 2
}
