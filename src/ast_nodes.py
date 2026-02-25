"""
CloudScript Abstract Syntax Tree (AST) Nodes
"""
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any


@dataclass
class ASTNode:
    """Base class for all AST nodes"""
    pass


@dataclass
class Program(ASTNode):
    """Root node of the AST"""
    services: List['Service'] = field(default_factory=list)


@dataclass
class Service(ASTNode):
    """Represents a microservice"""
    name: str
    endpoints: List['Endpoint'] = field(default_factory=list)
    connections: List['Connection'] = field(default_factory=list)
    configs: Dict[str, Any] = field(default_factory=dict)
    events: List['Event'] = field(default_factory=list)


@dataclass
class Endpoint(ASTNode):
    """Represents an API endpoint"""
    path: str
    method: Optional[str] = None
    response_type: Optional[str] = None
    cache: Optional[str] = None
    rate_limit: Optional[str] = None
    timeout: Optional[str] = None
    auth: Optional[str] = None
    fallback: Optional[str] = None


@dataclass
class Connection(ASTNode):
    """Represents a connection to another service"""
    target_service: str
    protocol: str = "http"


@dataclass
class Event(ASTNode):
    """Represents an event handler"""
    event_type: str  # start, shutdown, error, scale
    actions: List[str] = field(default_factory=list)


@dataclass
class DatabaseConfig(ASTNode):
    """Represents database configuration"""
    db_type: str
    settings: Dict[str, Any] = field(default_factory=dict)


def print_ast(node: ASTNode, indent: int = 0) -> str:
    """Pretty print AST for debugging"""
    result = []
    prefix = "  " * indent
    
    if isinstance(node, Program):
        result.append(f"{prefix}Program:")
        for service in node.services:
            result.append(print_ast(service, indent + 1))
    
    elif isinstance(node, Service):
        result.append(f"{prefix}Service: {node.name}")
        if node.endpoints:
            result.append(f"{prefix}  Endpoints:")
            for endpoint in node.endpoints:
                result.append(print_ast(endpoint, indent + 2))
        if node.connections:
            result.append(f"{prefix}  Connections:")
            for conn in node.connections:
                result.append(print_ast(conn, indent + 2))
        if node.configs:
            result.append(f"{prefix}  Configs:")
            for key, value in node.configs.items():
                result.append(f"{prefix}    {key}: {value}")
    
    elif isinstance(node, Endpoint):
        result.append(f"{prefix}Endpoint: {node.path}")
        if node.method:
            result.append(f"{prefix}  method: {node.method}")
        if node.response_type:
            result.append(f"{prefix}  response: {node.response_type}")
        if node.cache:
            result.append(f"{prefix}  cache: {node.cache}")
        if node.rate_limit:
            result.append(f"{prefix}  rateLimit: {node.rate_limit}")
        if node.timeout:
            result.append(f"{prefix}  timeout: {node.timeout}")
        if node.auth:
            result.append(f"{prefix}  auth: {node.auth}")
    
    elif isinstance(node, Connection):
        result.append(f"{prefix}Connection to {node.target_service} via {node.protocol}")
    
    return "\n".join(result)
