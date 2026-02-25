"""
CloudScript Unit Tests
"""
import unittest
import sys
sys.path.insert(0, '../src')

from lexer import Lexer, TokenType
from parser import Parser
from ast_nodes import Service, Endpoint


class TestLexer(unittest.TestCase):
    """Test the lexical analyzer"""
    
    def test_basic_tokens(self):
        """Test basic token recognition"""
        code = "service UserService { }"
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        
        self.assertEqual(tokens[0].type, TokenType.SERVICE)
        self.assertEqual(tokens[1].type, TokenType.IDENTIFIER)
        self.assertEqual(tokens[1].value, "UserService")
        self.assertEqual(tokens[2].type, TokenType.LBRACE)
        self.assertEqual(tokens[3].type, TokenType.RBRACE)
    
    def test_endpoint_tokens(self):
        """Test endpoint tokenization"""
        code = "endpoint /users { method: GET }"
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        
        self.assertEqual(tokens[0].type, TokenType.ENDPOINT)
        self.assertEqual(tokens[1].type, TokenType.PATH)
        self.assertEqual(tokens[1].value, "/users")
        self.assertEqual(tokens[3].type, TokenType.METHOD)
        self.assertEqual(tokens[5].type, TokenType.GET)
    
    def test_duration_tokens(self):
        """Test duration tokenization"""
        code = "cache: 5m timeout: 10s"
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        
        duration_tokens = [t for t in tokens if t.type == TokenType.DURATION]
        self.assertEqual(len(duration_tokens), 2)
        self.assertEqual(duration_tokens[0].value, "5m")
        self.assertEqual(duration_tokens[1].value, "10s")
    
    def test_path_parameters(self):
        """Test path with parameters"""
        code = "endpoint /users/:id { }"
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        
        path_token = [t for t in tokens if t.type == TokenType.PATH][0]
        self.assertEqual(path_token.value, "/users/:id")


class TestParser(unittest.TestCase):
    """Test the parser"""
    
    def test_simple_service(self):
        """Test parsing a simple service"""
        code = """
        service TestService {
            port: 8080
        }
        """
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        ast = parser.parse()
        
        self.assertEqual(len(ast.services), 1)
        self.assertEqual(ast.services[0].name, "TestService")
        self.assertEqual(ast.services[0].configs['port'], 8080)
    
    def test_endpoint_parsing(self):
        """Test parsing endpoints"""
        code = """
        service API {
            endpoint /users {
                method: GET
                response: User[]
                cache: 5m
            }
        }
        """
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        ast = parser.parse()
        
        service = ast.services[0]
        self.assertEqual(len(service.endpoints), 1)
        
        endpoint = service.endpoints[0]
        self.assertEqual(endpoint.path, "/users")
        self.assertEqual(endpoint.method, "GET")
        self.assertEqual(endpoint.response_type, "User[]")
        self.assertEqual(endpoint.cache, "5m")
    
    def test_connections(self):
        """Test parsing service connections"""
        code = """
        service OrderService {
            connect to PaymentService via grpc
            connect to UserService via http
        }
        """
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        ast = parser.parse()
        
        service = ast.services[0]
        self.assertEqual(len(service.connections), 2)
        self.assertEqual(service.connections[0].target_service, "PaymentService")
        self.assertEqual(service.connections[0].protocol, "grpc")
        self.assertEqual(service.connections[1].target_service, "UserService")
        self.assertEqual(service.connections[1].protocol, "http")
    
    def test_deployment_config(self):
        """Test parsing deployment configuration"""
        code = """
        service MyService {
            deploy on: kubernetes
            port: 8080
            replicas: 5
        }
        """
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        ast = parser.parse()
        
        service = ast.services[0]
        self.assertEqual(service.configs['platform'], "kubernetes")
        self.assertEqual(service.configs['port'], 8080)
        self.assertEqual(service.configs['replicas'], 5)
    
    def test_multiple_services(self):
        """Test parsing multiple services"""
        code = """
        service ServiceA {
            port: 8001
        }
        service ServiceB {
            port: 8002
        }
        """
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        ast = parser.parse()
        
        self.assertEqual(len(ast.services), 2)
        self.assertEqual(ast.services[0].name, "ServiceA")
        self.assertEqual(ast.services[1].name, "ServiceB")


class TestCodeGeneration(unittest.TestCase):
    """Test code generators"""
    
    def setUp(self):
        """Set up test fixtures"""
        code = """
        service TestService {
            endpoint /test {
                method: GET
                response: string
            }
            deploy on: docker
            port: 8080
        }
        """
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        self.ast = parser.parse()
        self.service = self.ast.services[0]
    
    def test_docker_generation(self):
        """Test Docker file generation"""
        from docker_generator import DockerGenerator
        
        generator = DockerGenerator()
        dockerfile = generator.generate_dockerfile(self.service)
        
        self.assertIn("FROM python", dockerfile)
        self.assertIn("EXPOSE 8080", dockerfile)
        self.assertIn("CMD", dockerfile)
    
    def test_kubernetes_generation(self):
        """Test Kubernetes manifest generation"""
        from kubernetes_generator import KubernetesGenerator
        
        generator = KubernetesGenerator()
        deployment = generator.generate_deployment(self.service)
        
        self.assertIn("kind: Deployment", deployment)
        self.assertIn("testservice", deployment.lower())
    
    def test_openapi_generation(self):
        """Test OpenAPI spec generation"""
        from openapi_generator import OpenAPIGenerator
        import json
        
        generator = OpenAPIGenerator()
        spec_json = generator.generate_openapi(self.service)
        spec = json.loads(spec_json)
        
        self.assertEqual(spec['openapi'], '3.0.3')
        self.assertEqual(spec['info']['title'], 'TestService')
        self.assertIn('/test', spec['paths'])


class TestEndToEnd(unittest.TestCase):
    """End-to-end integration tests"""
    
    def test_full_compilation(self):
        """Test complete compilation process"""
        code = """
        service UserService {
            endpoint /users {
                method: GET
                response: User[]
            }
            deploy on: kubernetes
            port: 8080
            replicas: 3
        }
        """
        
        # Lexical analysis
        lexer = Lexer(code)
        tokens = lexer.tokenize()
        self.assertGreater(len(tokens), 0)
        
        # Syntax analysis
        parser = Parser(tokens)
        ast = parser.parse()
        self.assertEqual(len(ast.services), 1)
        
        # Code generation
        from docker_generator import DockerGenerator
        from kubernetes_generator import KubernetesGenerator
        from openapi_generator import OpenAPIGenerator
        
        service = ast.services[0]
        
        docker_gen = DockerGenerator()
        dockerfile = docker_gen.generate_dockerfile(service)
        self.assertIn("UserService", dockerfile)
        
        k8s_gen = KubernetesGenerator()
        deployment = k8s_gen.generate_deployment(service)
        self.assertIn("Deployment", deployment)
        
        openapi_gen = OpenAPIGenerator()
        spec = openapi_gen.generate_openapi(service)
        self.assertIn("UserService", spec)


def run_tests():
    """Run all tests"""
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add all test classes
    suite.addTests(loader.loadTestsFromTestCase(TestLexer))
    suite.addTests(loader.loadTestsFromTestCase(TestParser))
    suite.addTests(loader.loadTestsFromTestCase(TestCodeGeneration))
    suite.addTests(loader.loadTestsFromTestCase(TestEndToEnd))
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    return result.wasSuccessful()


if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
