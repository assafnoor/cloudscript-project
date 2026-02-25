"""
CloudScript Compiler - Main Entry Point
"""
import os
import sys
import argparse
from pathlib import Path
from lexer import Lexer
from parser import Parser
from docker_generator import DockerGenerator
from kubernetes_generator import KubernetesGenerator
from openapi_generator import OpenAPIGenerator
from ast_nodes import print_ast


class CloudScriptCompiler:
    """Main compiler class"""
    
    def __init__(self, source_file: str, output_dir: str = "generated"):
        self.source_file = source_file
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
    def compile(self, target: str = "all", verbose: bool = False):
        """Compile CloudScript source code"""
        print(f"🚀 CloudScript Compiler v1.0")
        print(f"📄 Source: {self.source_file}")
        print(f"📁 Output: {self.output_dir}")
        print()
        
        # Read source file
        try:
            with open(self.source_file, 'r', encoding='utf-8') as f:
                source_code = f.read()
        except FileNotFoundError:
            print(f"❌ Error: File '{self.source_file}' not found")
            sys.exit(1)
        
        # Lexical analysis
        print("🔍 Lexical Analysis...")
        lexer = Lexer(source_code)
        tokens = lexer.tokenize()
        if verbose:
            print(f"   Found {len(tokens)} tokens")
        
        # Syntax analysis
        print("🔍 Syntax Analysis...")
        parser = Parser(tokens)
        ast = parser.parse()
        if verbose:
            print(f"   Parsed {len(ast.services)} service(s)")
            print("\n📊 AST:")
            print(print_ast(ast))
            print()
        
        # Code generation
        print("⚙️  Code Generation...")
        
        if target in ["all", "docker"]:
            self._generate_docker(ast, verbose)
        
        if target in ["all", "kubernetes", "k8s"]:
            self._generate_kubernetes(ast, verbose)
        
        if target in ["all", "openapi", "docs"]:
            self._generate_openapi(ast, verbose)
        
        print("\n✅ Compilation successful!")
        print(f"📦 Output files in: {self.output_dir}")
    
    def _generate_docker(self, ast, verbose):
        """Generate Docker files"""
        generator = DockerGenerator()
        
        for service in ast.services:
            service_dir = self.output_dir / service.name.lower()
            service_dir.mkdir(exist_ok=True)
            
            # Generate Dockerfile
            dockerfile_path = service_dir / "Dockerfile"
            with open(dockerfile_path, 'w') as f:
                f.write(generator.generate_dockerfile(service))
            if verbose:
                print(f"   ✓ Generated {dockerfile_path}")
            
            # Generate requirements.txt
            req_path = service_dir / "requirements.txt"
            with open(req_path, 'w') as f:
                f.write(generator.generate_requirements_txt(service))
            if verbose:
                print(f"   ✓ Generated {req_path}")
            
            # Generate app.py
            app_path = service_dir / "app.py"
            with open(app_path, 'w') as f:
                f.write(generator.generate_app_py(service))
            if verbose:
                print(f"   ✓ Generated {app_path}")
        
        # Generate docker-compose.yml
        compose_path = self.output_dir / "docker-compose.yml"
        with open(compose_path, 'w') as f:
            f.write(generator.generate_docker_compose(ast))
        print(f"   ✓ Generated Docker configuration")
    
    def _generate_kubernetes(self, ast, verbose):
        """Generate Kubernetes manifests"""
        generator = KubernetesGenerator()
        
        k8s_dir = self.output_dir / "kubernetes"
        k8s_dir.mkdir(exist_ok=True)
        
        for service in ast.services:
            manifest_path = k8s_dir / f"{service.name.lower()}.yaml"
            with open(manifest_path, 'w') as f:
                f.write(generator.generate_all_manifests(service))
            if verbose:
                print(f"   ✓ Generated {manifest_path}")
        
        print(f"   ✓ Generated Kubernetes manifests")
    
    def _generate_openapi(self, ast, verbose):
        """Generate OpenAPI documentation"""
        generator = OpenAPIGenerator()
        
        docs_dir = self.output_dir / "docs"
        docs_dir.mkdir(exist_ok=True)
        
        for service in ast.services:
            # Generate OpenAPI spec
            openapi_path = docs_dir / f"{service.name.lower()}-openapi.json"
            with open(openapi_path, 'w') as f:
                f.write(generator.generate_openapi(service))
            if verbose:
                print(f"   ✓ Generated {openapi_path}")
            
            # Generate Swagger UI
            swagger_path = docs_dir / f"{service.name.lower()}-swagger.html"
            with open(swagger_path, 'w') as f:
                f.write(generator.generate_swagger_ui_html(service))
            if verbose:
                print(f"   ✓ Generated {swagger_path}")
        
        print(f"   ✓ Generated API documentation")


def main():
    parser = argparse.ArgumentParser(
        description='CloudScript Compiler - DSL for Microservices',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  cloudscript compile service.cs                    # Compile all targets
  cloudscript compile service.cs --target docker    # Generate Docker files only
  cloudscript compile service.cs --target k8s       # Generate Kubernetes files only
  cloudscript compile service.cs -v                 # Verbose output
  cloudscript compile service.cs -o output/         # Custom output directory

Supported targets:
  all        - Generate all outputs (default)
  docker     - Docker files (Dockerfile, docker-compose.yml)
  k8s        - Kubernetes manifests
  kubernetes - Same as k8s
  openapi    - OpenAPI documentation
  docs       - Same as openapi
        """
    )
    
    parser.add_argument('command', choices=['compile'], help='Command to execute')
    parser.add_argument('source', help='CloudScript source file (.cs)')
    parser.add_argument('-t', '--target', default='all',
                       choices=['all', 'docker', 'kubernetes', 'k8s', 'openapi', 'docs'],
                       help='Generation target (default: all)')
    parser.add_argument('-o', '--output', default='generated',
                       help='Output directory (default: generated)')
    parser.add_argument('-v', '--verbose', action='store_true',
                       help='Verbose output')
    
    args = parser.parse_args()
    
    if args.command == 'compile':
        compiler = CloudScriptCompiler(args.source, args.output)
        compiler.compile(args.target, args.verbose)


if __name__ == "__main__":
    # If no arguments, show help
    if len(sys.argv) == 1:
        sys.argv.append('-h')
    main()
