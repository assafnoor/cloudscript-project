"""
Kubernetes Configuration Generator
"""
from ast_nodes import Program, Service
import yaml


class KubernetesGenerator:
    """Generates Kubernetes deployment manifests"""
    
    def generate_deployment(self, service: Service) -> str:
        """Generate Kubernetes Deployment"""
        port = service.configs.get('port', 8080)
        replicas = service.configs.get('replicas', 3)
        
        deployment = {
            'apiVersion': 'apps/v1',
            'kind': 'Deployment',
            'metadata': {
                'name': service.name.lower(),
                'labels': {
                    'app': service.name.lower(),
                    'generated-by': 'cloudscript'
                }
            },
            'spec': {
                'replicas': replicas,
                'selector': {
                    'matchLabels': {
                        'app': service.name.lower()
                    }
                },
                'template': {
                    'metadata': {
                        'labels': {
                            'app': service.name.lower()
                        }
                    },
                    'spec': {
                        'containers': [{
                            'name': service.name.lower(),
                            'image': f'{service.name.lower()}:latest',
                            'imagePullPolicy': 'IfNotPresent',
                            'ports': [{
                                'containerPort': port,
                                'name': 'http'
                            }],
                            'env': [
                                {
                                    'name': 'SERVICE_NAME',
                                    'value': service.name
                                },
                                {
                                    'name': 'PORT',
                                    'value': str(port)
                                }
                            ],
                            'resources': {
                                'requests': {
                                    'memory': '128Mi',
                                    'cpu': '100m'
                                },
                                'limits': {
                                    'memory': '256Mi',
                                    'cpu': '200m'
                                }
                            },
                            'livenessProbe': {
                                'httpGet': {
                                    'path': '/health',
                                    'port': port
                                },
                                'initialDelaySeconds': 30,
                                'periodSeconds': 10
                            },
                            'readinessProbe': {
                                'httpGet': {
                                    'path': '/health',
                                    'port': port
                                },
                                'initialDelaySeconds': 5,
                                'periodSeconds': 5
                            }
                        }]
                    }
                }
            }
        }
        
        return yaml.dump(deployment, default_flow_style=False, sort_keys=False)
    
    def generate_service(self, service: Service) -> str:
        """Generate Kubernetes Service"""
        port = service.configs.get('port', 8080)
        
        k8s_service = {
            'apiVersion': 'v1',
            'kind': 'Service',
            'metadata': {
                'name': service.name.lower(),
                'labels': {
                    'app': service.name.lower()
                }
            },
            'spec': {
                'type': 'ClusterIP',
                'ports': [{
                    'port': 80,
                    'targetPort': port,
                    'protocol': 'TCP',
                    'name': 'http'
                }],
                'selector': {
                    'app': service.name.lower()
                }
            }
        }
        
        return yaml.dump(k8s_service, default_flow_style=False, sort_keys=False)
    
    def generate_ingress(self, service: Service) -> str:
        """Generate Kubernetes Ingress"""
        ingress = {
            'apiVersion': 'networking.k8s.io/v1',
            'kind': 'Ingress',
            'metadata': {
                'name': f'{service.name.lower()}-ingress',
                'annotations': {
                    'nginx.ingress.kubernetes.io/rewrite-target': '/',
                    'cert-manager.io/cluster-issuer': 'letsencrypt-prod'
                }
            },
            'spec': {
                'ingressClassName': 'nginx',
                'rules': [{
                    'host': f'{service.name.lower()}.example.com',
                    'http': {
                        'paths': [{
                            'path': '/',
                            'pathType': 'Prefix',
                            'backend': {
                                'service': {
                                    'name': service.name.lower(),
                                    'port': {
                                        'number': 80
                                    }
                                }
                            }
                        }]
                    }
                }],
                'tls': [{
                    'hosts': [f'{service.name.lower()}.example.com'],
                    'secretName': f'{service.name.lower()}-tls'
                }]
            }
        }
        
        return yaml.dump(ingress, default_flow_style=False, sort_keys=False)
    
    def generate_hpa(self, service: Service) -> str:
        """Generate Horizontal Pod Autoscaler"""
        replicas = service.configs.get('replicas', 3)
        
        hpa = {
            'apiVersion': 'autoscaling/v2',
            'kind': 'HorizontalPodAutoscaler',
            'metadata': {
                'name': f'{service.name.lower()}-hpa'
            },
            'spec': {
                'scaleTargetRef': {
                    'apiVersion': 'apps/v1',
                    'kind': 'Deployment',
                    'name': service.name.lower()
                },
                'minReplicas': replicas,
                'maxReplicas': replicas * 3,
                'metrics': [
                    {
                        'type': 'Resource',
                        'resource': {
                            'name': 'cpu',
                            'target': {
                                'type': 'Utilization',
                                'averageUtilization': 70
                            }
                        }
                    },
                    {
                        'type': 'Resource',
                        'resource': {
                            'name': 'memory',
                            'target': {
                                'type': 'Utilization',
                                'averageUtilization': 80
                            }
                        }
                    }
                ]
            }
        }
        
        return yaml.dump(hpa, default_flow_style=False, sort_keys=False)
    
    def generate_configmap(self, service: Service) -> str:
        """Generate ConfigMap for service configuration"""
        config_data = {}
        
        # Add database connection string if configured
        if 'database' in service.configs:
            db_config = service.configs['database']
            db_type = db_config.get('type', 'postgres')
            config_data['DATABASE_TYPE'] = db_type
            config_data['DATABASE_URL'] = f'{db_type}://user:password@{service.name.lower()}-db:5432/{service.name.lower()}'
        
        # Add connected services
        for conn in service.connections:
            key = f'{conn.target_service.upper()}_URL'
            config_data[key] = f'http://{conn.target_service.lower()}'
        
        configmap = {
            'apiVersion': 'v1',
            'kind': 'ConfigMap',
            'metadata': {
                'name': f'{service.name.lower()}-config'
            },
            'data': config_data
        }
        
        return yaml.dump(configmap, default_flow_style=False, sort_keys=False)
    
    def generate_all_manifests(self, service: Service) -> str:
        """Generate all Kubernetes manifests in one file"""
        manifests = [
            "# Kubernetes manifests for " + service.name,
            "# Generated by CloudScript",
            "",
            self.generate_deployment(service),
            "---",
            "",
            self.generate_service(service),
            "---",
            "",
            self.generate_ingress(service),
            "---",
            "",
            self.generate_hpa(service),
            "---",
            "",
            self.generate_configmap(service)
        ]
        
        return "\n".join(manifests)


def main():
    from lexer import Lexer
    from parser import Parser
    
    code = """
    service OrderService {
        endpoint /orders {
            method: POST
            response: Order
        }
        
        connect to PaymentService via grpc
        connect to InventoryService via http
        
        deploy on: kubernetes
        port: 8080
        replicas: 5
        
        database postgres {
            host: "localhost"
            port: 5432
        }
    }
    """
    
    lexer = Lexer(code)
    tokens = lexer.tokenize()
    parser = Parser(tokens)
    ast = parser.parse()
    
    generator = KubernetesGenerator()
    
    if ast.services:
        service = ast.services[0]
        print("=== Kubernetes Manifests ===")
        print(generator.generate_all_manifests(service))


if __name__ == "__main__":
    main()
