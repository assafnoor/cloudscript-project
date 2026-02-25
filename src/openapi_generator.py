"""
OpenAPI/Swagger Documentation Generator
"""
from ast_nodes import Program, Service, Endpoint
import json
from typing import Dict, Any


class OpenAPIGenerator:
    """Generates OpenAPI 3.0 specification"""
    
    def generate_openapi(self, service: Service) -> str:
        """Generate complete OpenAPI specification"""
        port = service.configs.get('port', 8080)
        
        spec = {
            "openapi": "3.0.3",
            "info": {
                "title": service.name,
                "description": f"Auto-generated API documentation for {service.name}",
                "version": "1.0.0",
                "contact": {
                    "name": "API Support",
                    "email": "support@example.com"
                },
                "license": {
                    "name": "MIT",
                    "url": "https://opensource.org/licenses/MIT"
                }
            },
            "servers": [
                {
                    "url": f"http://localhost:{port}",
                    "description": "Development server"
                },
                {
                    "url": f"https://{service.name.lower()}.example.com",
                    "description": "Production server"
                }
            ],
            "paths": {},
            "components": {
                "schemas": {},
                "securitySchemes": {}
            }
        }
        
        # Generate paths from endpoints
        for endpoint in service.endpoints:
            path = endpoint.path
            method = (endpoint.method or "GET").lower()
            
            if path not in spec["paths"]:
                spec["paths"][path] = {}
            
            operation = self._generate_operation(endpoint, service)
            spec["paths"][path][method] = operation
        
        # Add security schemes if any endpoint requires auth
        has_auth = any(e.auth == "required" for e in service.endpoints)
        if has_auth:
            spec["components"]["securitySchemes"] = {
                "BearerAuth": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT"
                },
                "ApiKeyAuth": {
                    "type": "apiKey",
                    "in": "header",
                    "name": "X-API-Key"
                }
            }
        
        # Generate example schemas
        spec["components"]["schemas"] = self._generate_schemas(service)
        
        return json.dumps(spec, indent=2)
    
    def _generate_operation(self, endpoint: Endpoint, service: Service) -> Dict[str, Any]:
        """Generate OpenAPI operation object"""
        method = (endpoint.method or "GET").upper()
        response_type = endpoint.response_type or "object"
        
        operation = {
            "summary": f"{method} {endpoint.path}",
            "description": f"Endpoint for {endpoint.path}",
            "operationId": self._generate_operation_id(method, endpoint.path),
            "tags": [service.name],
            "parameters": [],
            "responses": {
                "200": {
                    "description": "Successful response",
                    "content": {
                        "application/json": {
                            "schema": self._type_to_schema(response_type)
                        }
                    }
                },
                "400": {
                    "description": "Bad request"
                },
                "500": {
                    "description": "Internal server error"
                }
            }
        }
        
        # Add path parameters
        if ':' in endpoint.path:
            parts = endpoint.path.split('/')
            for part in parts:
                if part.startswith(':'):
                    param_name = part[1:]
                    operation["parameters"].append({
                        "name": param_name,
                        "in": "path",
                        "required": True,
                        "schema": {"type": "string"},
                        "description": f"The {param_name} identifier"
                    })
        
        # Add request body for POST/PUT/PATCH
        if method in ["POST", "PUT", "PATCH"]:
            operation["requestBody"] = {
                "required": True,
                "content": {
                    "application/json": {
                        "schema": self._type_to_schema(response_type.rstrip('[]'))
                    }
                }
            }
        
        # Add security if required
        if endpoint.auth == "required":
            operation["security"] = [
                {"BearerAuth": []},
                {"ApiKeyAuth": []}
            ]
        
        # Add rate limiting info
        if endpoint.rate_limit:
            operation["x-rate-limit"] = endpoint.rate_limit
        
        # Add caching info
        if endpoint.cache:
            operation["x-cache-duration"] = endpoint.cache
        
        # Add timeout info
        if endpoint.timeout:
            operation["x-timeout"] = endpoint.timeout
        
        return operation
    
    def _type_to_schema(self, type_name: str) -> Dict[str, Any]:
        """Convert CloudScript type to OpenAPI schema"""
        if type_name.endswith('[]'):
            base_type = type_name[:-2]
            return {
                "type": "array",
                "items": self._type_to_schema(base_type)
            }
        
        # Primitive types
        type_mapping = {
            "string": {"type": "string"},
            "int": {"type": "integer"},
            "float": {"type": "number"},
            "bool": {"type": "boolean"},
            "object": {"type": "object"}
        }
        
        if type_name in type_mapping:
            return type_mapping[type_name]
        
        # Custom types - reference to schema
        return {"$ref": f"#/components/schemas/{type_name}"}
    
    def _generate_operation_id(self, method: str, path: str) -> str:
        """Generate unique operation ID"""
        # Convert path to camelCase
        parts = path.strip('/').replace(':', '').split('/')
        if not parts or parts == ['']:
            return method.lower() + 'Root'
        
        operation_id = method.lower()
        for part in parts:
            operation_id += part.capitalize()
        
        return operation_id
    
    def _generate_schemas(self, service: Service) -> Dict[str, Any]:
        """Generate example schemas for custom types"""
        schemas = {}
        
        # Extract unique response types
        types = set()
        for endpoint in service.endpoints:
            if endpoint.response_type:
                base_type = endpoint.response_type.rstrip('[]')
                if base_type not in ['string', 'int', 'float', 'bool', 'object']:
                    types.add(base_type)
        
        # Generate example schemas
        for type_name in types:
            schemas[type_name] = self._generate_example_schema(type_name)
        
        # Add common error schema
        schemas["Error"] = {
            "type": "object",
            "properties": {
                "code": {
                    "type": "integer",
                    "description": "Error code"
                },
                "message": {
                    "type": "string",
                    "description": "Error message"
                },
                "details": {
                    "type": "object",
                    "description": "Additional error details"
                }
            },
            "required": ["code", "message"]
        }
        
        return schemas
    
    def _generate_example_schema(self, type_name: str) -> Dict[str, Any]:
        """Generate example schema for a custom type"""
        # Common patterns
        if type_name == "User":
            return {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "name": {"type": "string"},
                    "email": {"type": "string", "format": "email"},
                    "created_at": {"type": "string", "format": "date-time"}
                },
                "required": ["id", "name", "email"]
            }
        elif type_name == "Order":
            return {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "user_id": {"type": "string"},
                    "items": {"type": "array", "items": {"$ref": "#/components/schemas/OrderItem"}},
                    "total": {"type": "number", "format": "float"},
                    "status": {"type": "string", "enum": ["pending", "processing", "completed", "cancelled"]},
                    "created_at": {"type": "string", "format": "date-time"}
                },
                "required": ["id", "user_id", "items", "total", "status"]
            }
        elif type_name == "Payment":
            return {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "amount": {"type": "number"},
                    "currency": {"type": "string"},
                    "status": {"type": "string"},
                    "created_at": {"type": "string", "format": "date-time"}
                }
            }
        else:
            # Generic schema
            return {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "name": {"type": "string"},
                    "created_at": {"type": "string", "format": "date-time"}
                }
            }
    
    def generate_swagger_ui_html(self, service: Service) -> str:
        """Generate HTML page with Swagger UI"""
        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{service.name} API Documentation</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {{
            SwaggerUIBundle({{
                url: "./openapi.json",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            }})
        }}
    </script>
</body>
</html>
"""
        return html


def main():
    from lexer import Lexer
    from parser import Parser
    
    code = """
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
        }
        
        endpoint /users {
            method: POST
            response: User
            auth: required
        }
        
        port: 8080
    }
    """
    
    lexer = Lexer(code)
    tokens = lexer.tokenize()
    parser = Parser(tokens)
    ast = parser.parse()
    
    generator = OpenAPIGenerator()
    
    if ast.services:
        service = ast.services[0]
        print("=== OpenAPI Specification ===")
        print(generator.generate_openapi(service))


if __name__ == "__main__":
    main()
