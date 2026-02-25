# CloudScript Language Grammar

## Complete BNF Grammar

```bnf
<program>           ::= <service>+

<service>           ::= "service" <identifier> "{" <service_body> "}"

<service_body>      ::= (<endpoint> | <connection> | <config> | <event>)*

<endpoint>          ::= "endpoint" <path> "{" <endpoint_config>+ "}"

<endpoint_config>   ::= <method_def> 
                      | <response_def> 
                      | <cache_def>
                      | <ratelimit_def>
                      | <timeout_def>
                      | <auth_def>
                      | <fallback_def>

<method_def>        ::= "method:" ("GET" | "POST" | "PUT" | "DELETE" | "PATCH")

<response_def>      ::= "response:" <type>

<cache_def>         ::= "cache:" <duration>

<ratelimit_def>     ::= "rateLimit:" <number> "/" <time_unit>

<timeout_def>       ::= "timeout:" <duration>

<auth_def>          ::= "auth:" ("required" | "optional" | "none")

<fallback_def>      ::= "fallback:" <identifier>

<connection>        ::= "connect" "to" <identifier> ("via" <protocol>)?

<protocol>          ::= "http" | "grpc" | "rabbitmq" | "kafka"

<config>            ::= "deploy" "on:" <platform>
                      | "port:" <number>
                      | "replicas:" <number>
                      | "database:" <db_config>

<platform>          ::= "docker" | "kubernetes" | "aws" | "azure" | "gcp"

<db_config>         ::= <identifier> "{" <db_settings> "}"

<event>             ::= "on" <event_type> "{" <action>+ "}"

<event_type>        ::= "start" | "shutdown" | "error" | "scale"

<action>            ::= <identifier> "(" <args>? ")"

<type>              ::= "int" | "string" | "bool" | "float" 
                      | <identifier> 
                      | <type> "[]"
                      | "{" <field_list> "}"

<field_list>        ::= <field> ("," <field>)*

<field>             ::= <identifier> ":" <type>

<duration>          ::= <number> <time_unit>

<time_unit>         ::= "s" | "m" | "h" | "d"

<path>              ::= "/" (<identifier> | ":" <identifier> | "/")*

<identifier>        ::= [a-zA-Z_][a-zA-Z0-9_]*

<number>            ::= [0-9]+

<string>            ::= '"' [^"]* '"'
```

## Example Programs

### Example 1: Simple API Service
```cloudscript
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
        timeout: 3s
        fallback: defaultUser
    }
    
    endpoint /users {
        method: POST
        response: User
        auth: required
    }
    
    deploy on: docker
    port: 8080
    replicas: 3
}
```

### Example 2: Microservices Architecture
```cloudscript
service OrderService {
    endpoint /orders {
        method: POST
        response: Order
        timeout: 5s
    }
    
    endpoint /orders/:id {
        method: GET
        response: Order
        cache: 2m
    }
    
    connect to PaymentService via grpc
    connect to InventoryService via http
    connect to NotificationService via rabbitmq
    
    database postgres {
        host: "localhost"
        port: 5432
    }
    
    deploy on: kubernetes
    replicas: 5
    port: 8080
}

service PaymentService {
    endpoint /payments {
        method: POST
        response: Payment
        timeout: 10s
        auth: required
    }
    
    connect to BankAPI via http
    
    deploy on: kubernetes
    replicas: 3
    port: 8081
}
```

### Example 3: Event-Driven Service
```cloudscript
service NotificationService {
    endpoint /notify {
        method: POST
        response: bool
    }
    
    on start {
        connectToQueue("notifications")
        initEmailClient()
    }
    
    on error {
        logError()
        sendAlert("admin@example.com")
    }
    
    connect to EmailService via http
    connect to SMSService via grpc
    
    deploy on: kubernetes
    replicas: 2
}
```
