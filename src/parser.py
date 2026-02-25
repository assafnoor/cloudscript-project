"""
CloudScript Parser - Builds AST from tokens
"""
from typing import List, Optional
from lexer import Token, TokenType, Lexer
from ast_nodes import *


class Parser:
    def __init__(self, tokens: List[Token]):
        self.tokens = tokens
        self.position = 0
    
    def current_token(self) -> Optional[Token]:
        if self.position < len(self.tokens):
            return self.tokens[self.position]
        return None
    
    def peek_token(self, offset: int = 1) -> Optional[Token]:
        pos = self.position + offset
        if pos < len(self.tokens):
            return self.tokens[pos]
        return None
    
    def advance(self):
        self.position += 1
    
    def expect(self, token_type: TokenType) -> Token:
        token = self.current_token()
        if not token or token.type != token_type:
            raise SyntaxError(
                f"Expected {token_type.name}, got {token.type.name if token else 'EOF'} "
                f"at line {token.line if token else 'end'}"
            )
        self.advance()
        return token
    
    def match(self, *token_types: TokenType) -> bool:
        token = self.current_token()
        return token and token.type in token_types
    
    def parse(self) -> Program:
        """Parse the entire program"""
        program = Program()
        
        while self.current_token() and self.current_token().type != TokenType.EOF:
            if self.match(TokenType.SERVICE):
                service = self.parse_service()
                program.services.append(service)
            else:
                self.advance()
        
        return program
    
    def parse_service(self) -> Service:
        """Parse a service definition"""
        self.expect(TokenType.SERVICE)
        name_token = self.expect(TokenType.IDENTIFIER)
        service = Service(name=name_token.value)
        
        self.expect(TokenType.LBRACE)
        
        while not self.match(TokenType.RBRACE):
            if self.match(TokenType.ENDPOINT):
                endpoint = self.parse_endpoint()
                service.endpoints.append(endpoint)
            
            elif self.match(TokenType.CONNECT):
                connection = self.parse_connection()
                service.connections.append(connection)
            
            elif self.match(TokenType.DEPLOY):
                self.parse_deploy_config(service)
            
            elif self.match(TokenType.PORT):
                self.expect(TokenType.PORT)
                self.expect(TokenType.COLON)
                port = self.expect(TokenType.NUMBER)
                service.configs['port'] = int(port.value)
            
            elif self.match(TokenType.REPLICAS):
                self.expect(TokenType.REPLICAS)
                self.expect(TokenType.COLON)
                replicas = self.expect(TokenType.NUMBER)
                service.configs['replicas'] = int(replicas.value)
            
            elif self.match(TokenType.DATABASE):
                self.parse_database_config(service)
            
            else:
                # Skip unknown tokens
                self.advance()
        
        self.expect(TokenType.RBRACE)
        return service
    
    def parse_endpoint(self) -> Endpoint:
        """Parse an endpoint definition"""
        self.expect(TokenType.ENDPOINT)
        path_token = self.expect(TokenType.PATH)
        endpoint = Endpoint(path=path_token.value)
        
        self.expect(TokenType.LBRACE)
        
        while not self.match(TokenType.RBRACE):
            if self.match(TokenType.METHOD):
                self.expect(TokenType.METHOD)
                self.expect(TokenType.COLON)
                method_token = self.current_token()
                if self.match(TokenType.GET, TokenType.POST, TokenType.PUT, 
                            TokenType.DELETE, TokenType.PATCH):
                    endpoint.method = method_token.value
                    self.advance()
            
            elif self.match(TokenType.RESPONSE):
                self.expect(TokenType.RESPONSE)
                self.expect(TokenType.COLON)
                response_token = self.expect(TokenType.IDENTIFIER)
                # Handle arrays (User[])
                if self.match(TokenType.LBRACKET):
                    self.advance()
                    self.expect(TokenType.RBRACKET)
                    endpoint.response_type = response_token.value + "[]"
                else:
                    endpoint.response_type = response_token.value
            
            elif self.match(TokenType.CACHE):
                self.expect(TokenType.CACHE)
                self.expect(TokenType.COLON)
                cache_token = self.expect(TokenType.DURATION)
                endpoint.cache = cache_token.value
            
            elif self.match(TokenType.RATELIMIT):
                self.expect(TokenType.RATELIMIT)
                self.expect(TokenType.COLON)
                # Parse rate limit (e.g., 100/m)
                num = self.expect(TokenType.NUMBER)
                # Skip slash if present
                if self.current_token() and self.current_token().value == '/':
                    self.advance()
                unit = self.current_token()
                if unit and unit.type == TokenType.IDENTIFIER:
                    endpoint.rate_limit = f"{num.value}/{unit.value}"
                    self.advance()
                else:
                    endpoint.rate_limit = num.value
            
            elif self.match(TokenType.TIMEOUT):
                self.expect(TokenType.TIMEOUT)
                self.expect(TokenType.COLON)
                timeout_token = self.expect(TokenType.DURATION)
                endpoint.timeout = timeout_token.value
            
            elif self.match(TokenType.AUTH):
                self.expect(TokenType.AUTH)
                self.expect(TokenType.COLON)
                auth_token = self.current_token()
                if self.match(TokenType.REQUIRED, TokenType.OPTIONAL, TokenType.NONE):
                    endpoint.auth = auth_token.value
                    self.advance()
            
            elif self.match(TokenType.FALLBACK):
                self.expect(TokenType.FALLBACK)
                self.expect(TokenType.COLON)
                fallback_token = self.expect(TokenType.IDENTIFIER)
                endpoint.fallback = fallback_token.value
            
            else:
                # Skip unknown tokens
                self.advance()
        
        self.expect(TokenType.RBRACE)
        return endpoint
    
    def parse_connection(self) -> Connection:
        """Parse a connection definition"""
        self.expect(TokenType.CONNECT)
        self.expect(TokenType.TO)
        target = self.expect(TokenType.IDENTIFIER)
        
        protocol = "http"  # default
        if self.match(TokenType.VIA):
            self.advance()
            proto_token = self.current_token()
            if self.match(TokenType.HTTP, TokenType.GRPC, TokenType.RABBITMQ, TokenType.KAFKA):
                protocol = proto_token.value
                self.advance()
        
        return Connection(target_service=target.value, protocol=protocol)
    
    def parse_deploy_config(self, service: Service):
        """Parse deployment configuration"""
        self.expect(TokenType.DEPLOY)
        self.expect(TokenType.ON)
        self.expect(TokenType.COLON)
        
        platform_token = self.current_token()
        if self.match(TokenType.DOCKER, TokenType.KUBERNETES, TokenType.AWS, 
                     TokenType.AZURE, TokenType.GCP):
            service.configs['platform'] = platform_token.value
            self.advance()
    
    def parse_database_config(self, service: Service):
        """Parse database configuration"""
        self.expect(TokenType.DATABASE)
        db_type = self.expect(TokenType.IDENTIFIER)
        
        service.configs['database'] = {
            'type': db_type.value,
            'settings': {}
        }
        
        if self.match(TokenType.LBRACE):
            self.advance()
            while not self.match(TokenType.RBRACE):
                if self.match(TokenType.IDENTIFIER):
                    key = self.expect(TokenType.IDENTIFIER)
                    self.expect(TokenType.COLON)
                    
                    value_token = self.current_token()
                    if self.match(TokenType.STRING):
                        value = value_token.value
                        self.advance()
                    elif self.match(TokenType.NUMBER):
                        value = int(value_token.value)
                        self.advance()
                    else:
                        value = None
                        self.advance()
                    
                    service.configs['database']['settings'][key.value] = value
                else:
                    self.advance()
            
            self.expect(TokenType.RBRACE)


def main():
    # Test the parser
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
        
        connect to AuthService via http
        deploy on: docker
        port: 8080
        replicas: 3
    }
    """
    
    lexer = Lexer(code)
    tokens = lexer.tokenize()
    
    parser = Parser(tokens)
    ast = parser.parse()
    
    print("AST:")
    print(print_ast(ast))


if __name__ == "__main__":
    main()
