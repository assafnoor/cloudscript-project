"""
CloudScript Lexer - Tokenizes CloudScript source code
"""
import re
from enum import Enum, auto
from dataclasses import dataclass
from typing import List, Optional


class TokenType(Enum):
    # Keywords
    SERVICE = auto()
    ENDPOINT = auto()
    CONNECT = auto()
    TO = auto()
    VIA = auto()
    DEPLOY = auto()
    ON = auto()
    DATABASE = auto()
    REPLICAS = auto()
    PORT = auto()
    METHOD = auto()
    RESPONSE = auto()
    CACHE = auto()
    RATELIMIT = auto()
    TIMEOUT = auto()
    AUTH = auto()
    FALLBACK = auto()
    EVENT_ON = auto()
    
    # HTTP Methods
    GET = auto()
    POST = auto()
    PUT = auto()
    DELETE = auto()
    PATCH = auto()
    
    # Protocols
    HTTP = auto()
    GRPC = auto()
    RABBITMQ = auto()
    KAFKA = auto()
    
    # Platforms
    DOCKER = auto()
    KUBERNETES = auto()
    AWS = auto()
    AZURE = auto()
    GCP = auto()
    
    # Auth levels
    REQUIRED = auto()
    OPTIONAL = auto()
    NONE = auto()
    
    # Literals
    IDENTIFIER = auto()
    NUMBER = auto()
    STRING = auto()
    PATH = auto()
    DURATION = auto()
    
    # Symbols
    LBRACE = auto()
    RBRACE = auto()
    LBRACKET = auto()
    RBRACKET = auto()
    COLON = auto()
    COMMA = auto()
    SLASH = auto()
    LPAREN = auto()
    RPAREN = auto()
    
    # Special
    EOF = auto()
    NEWLINE = auto()


@dataclass
class Token:
    type: TokenType
    value: str
    line: int
    column: int


class Lexer:
    def __init__(self, source: str):
        self.source = source
        self.position = 0
        self.line = 1
        self.column = 1
        self.tokens: List[Token] = []
        
        # Keywords mapping
        self.keywords = {
            'service': TokenType.SERVICE,
            'endpoint': TokenType.ENDPOINT,
            'connect': TokenType.CONNECT,
            'to': TokenType.TO,
            'via': TokenType.VIA,
            'deploy': TokenType.DEPLOY,
            'on': TokenType.ON,
            'database': TokenType.DATABASE,
            'replicas': TokenType.REPLICAS,
            'port': TokenType.PORT,
            'method': TokenType.METHOD,
            'response': TokenType.RESPONSE,
            'cache': TokenType.CACHE,
            'rateLimit': TokenType.RATELIMIT,
            'timeout': TokenType.TIMEOUT,
            'auth': TokenType.AUTH,
            'fallback': TokenType.FALLBACK,
            # HTTP Methods
            'GET': TokenType.GET,
            'POST': TokenType.POST,
            'PUT': TokenType.PUT,
            'DELETE': TokenType.DELETE,
            'PATCH': TokenType.PATCH,
            # Protocols
            'http': TokenType.HTTP,
            'grpc': TokenType.GRPC,
            'rabbitmq': TokenType.RABBITMQ,
            'kafka': TokenType.KAFKA,
            # Platforms
            'docker': TokenType.DOCKER,
            'kubernetes': TokenType.KUBERNETES,
            'aws': TokenType.AWS,
            'azure': TokenType.AZURE,
            'gcp': TokenType.GCP,
            # Auth
            'required': TokenType.REQUIRED,
            'optional': TokenType.OPTIONAL,
            'none': TokenType.NONE,
        }
    
    def current_char(self) -> Optional[str]:
        if self.position >= len(self.source):
            return None
        return self.source[self.position]
    
    def peek_char(self, offset: int = 1) -> Optional[str]:
        pos = self.position + offset
        if pos >= len(self.source):
            return None
        return self.source[pos]
    
    def advance(self):
        if self.position < len(self.source):
            if self.source[self.position] == '\n':
                self.line += 1
                self.column = 1
            else:
                self.column += 1
            self.position += 1
    
    def skip_whitespace(self):
        while self.current_char() and self.current_char() in ' \t\r\n':
            self.advance()
    
    def skip_comment(self):
        if self.current_char() == '/' and self.peek_char() == '/':
            while self.current_char() and self.current_char() != '\n':
                self.advance()
            if self.current_char() == '\n':
                self.advance()
    
    def read_string(self) -> str:
        result = ''
        self.advance()  # Skip opening quote
        while self.current_char() and self.current_char() != '"':
            if self.current_char() == '\\':
                self.advance()
                if self.current_char():
                    result += self.current_char()
                    self.advance()
            else:
                result += self.current_char()
                self.advance()
        self.advance()  # Skip closing quote
        return result
    
    def read_number(self) -> str:
        result = ''
        while self.current_char() and (self.current_char().isdigit() or self.current_char() == '.'):
            result += self.current_char()
            self.advance()
        return result
    
    def read_identifier(self) -> str:
        result = ''
        while self.current_char() and (self.current_char().isalnum() or self.current_char() == '_'):
            result += self.current_char()
            self.advance()
        return result
    
    def read_path(self) -> str:
        result = '/'
        self.advance()  # Skip initial /
        while self.current_char() and (self.current_char().isalnum() or 
                                       self.current_char() in '/_-:'):
            result += self.current_char()
            self.advance()
        return result
    
    def read_duration(self) -> str:
        num = self.read_number()
        unit = self.current_char()
        if unit in 'smhd':
            self.advance()
            return num + unit
        return num
    
    def add_token(self, token_type: TokenType, value: str):
        self.tokens.append(Token(token_type, value, self.line, self.column))
    
    def tokenize(self) -> List[Token]:
        while self.position < len(self.source):
            self.skip_whitespace()
            
            # Check for comments before processing
            if self.current_char() == '/' and self.peek_char() == '/':
                self.skip_comment()
                continue
            
            if self.position >= len(self.source):
                break
            
            char = self.current_char()
            col = self.column
            
            # Single character tokens
            if char == '{':
                self.add_token(TokenType.LBRACE, char)
                self.advance()
            elif char == '}':
                self.add_token(TokenType.RBRACE, char)
                self.advance()
            elif char == '[':
                self.add_token(TokenType.LBRACKET, char)
                self.advance()
            elif char == ']':
                self.add_token(TokenType.RBRACKET, char)
                self.advance()
            elif char == ':':
                self.add_token(TokenType.COLON, char)
                self.advance()
            elif char == ',':
                self.add_token(TokenType.COMMA, char)
                self.advance()
            elif char == '(':
                self.add_token(TokenType.LPAREN, char)
                self.advance()
            elif char == ')':
                self.add_token(TokenType.RPAREN, char)
                self.advance()
            
            # Path (starts with /)
            elif char == '/' and self.peek_char() and (self.peek_char().isalpha() or self.peek_char() == ':'):
                path = self.read_path()
                self.add_token(TokenType.PATH, path)
            
            # String
            elif char == '"':
                string = self.read_string()
                self.add_token(TokenType.STRING, string)
            
            # Number or Duration
            elif char.isdigit():
                start_pos = self.position
                num = self.read_number()
                if self.current_char() and self.current_char() in 'smhd':
                    unit = self.current_char()
                    self.advance()
                    self.add_token(TokenType.DURATION, num + unit)
                else:
                    self.add_token(TokenType.NUMBER, num)
            
            # Identifier or Keyword
            elif char.isalpha() or char == '_':
                identifier = self.read_identifier()
                token_type = self.keywords.get(identifier, TokenType.IDENTIFIER)
                self.add_token(token_type, identifier)
            
            else:
                # Skip unknown characters (like standalone /)
                self.advance()
        
        self.add_token(TokenType.EOF, '')
        return self.tokens


def main():
    # Test the lexer
    code = """
    service UserService {
        endpoint /users {
            method: GET
            response: User[]
            cache: 5m
            rateLimit: 100/m
        }
        
        connect to AuthService via http
        deploy on: docker
        port: 8080
    }
    """
    
    lexer = Lexer(code)
    tokens = lexer.tokenize()
    
    print("Tokens:")
    for token in tokens:
        if token.type != TokenType.EOF:
            print(f"  {token.type.name:20} | {token.value:20} | Line {token.line}")


if __name__ == "__main__":
    main()
