// Simple Blog API
// Example 2: Basic blogging platform

service BlogService {
    endpoint /posts {
        method: GET
        response: Post[]
        cache: 5m
        rateLimit: 100/m
    }
    
    endpoint /posts/:id {
        method: GET
        response: Post
        cache: 10m
    }
    
    endpoint /posts {
        method: POST
        response: Post
        auth: required
    }
    
    endpoint /posts/:id {
        method: PUT
        response: Post
        auth: required
    }
    
    endpoint /posts/:id {
        method: DELETE
        response: bool
        auth: required
    }
    
    endpoint /posts/:id/comments {
        method: GET
        response: Comment[]
    }
    
    endpoint /posts/:id/comments {
        method: POST
        response: Comment
        auth: required
    }
    
    connect to AuthService via http
    
    deploy on: docker
    port: 8080
    replicas: 2
    
    database postgres {
        host: "localhost"
        port: 5432
    }
}

service AuthService {
    endpoint /auth/login {
        method: POST
        response: Token
        timeout: 5s
    }
    
    endpoint /auth/register {
        method: POST
        response: User
    }
    
    endpoint /auth/refresh {
        method: POST
        response: Token
    }
    
    endpoint /auth/logout {
        method: POST
        response: bool
        auth: required
    }
    
    deploy on: docker
    port: 8081
    replicas: 2
    
    database redis {
        host: "localhost"
        port: 6379
    }
}
