# Ecommerce Application Deployment on Google Kubernetes Engine (GKE)

## Project Overview

This project demonstrates the deployment of a full-stack e-commerce application on Google Kubernetes Engine (GKE). The application consists of three main components:

- **Frontend:** A React-based web application served via NGINX.
- **Backend:** A Node.js/Express API server.
- **Database:** MongoDB deployed using a StatefulSet to ensure persistent storage.

The deployment uses Docker images hosted on Docker Hub, Kubernetes manifests for resource configuration, and an NGINX Ingress Controller for external traffic routing.

## Live Application

Access the running application here:  
**http://104.199.35.210/**

## Project Structure

```
.
├── explanation.md           # Explanation of design choices and Kubernetes objects
├── README.md                # Project overview and instructions
└── k8s-manifests            # Kubernetes manifests folder
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-configmap.yaml
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── ingress.yaml
    ├── mongo-service.yaml
    └── mongo-statefulset.yaml
```

## Prerequisites

- Google Cloud Platform account with GKE enabled  
- `kubectl` CLI configured for your GKE cluster  
- Docker installed and Docker Hub account for pushing images  
- NGINX Ingress Controller installed on your cluster

## Setup and Deployment Instructions

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/Papsy-ops/ecommerce-gke-deployment.git
   cd ecommerce-gke-deployment
   ```

2. **Build and Push Docker Images**  
   Ensure your Docker images are tagged and pushed to Docker Hub.  
   #Treating mongo image as static... : papetua/mongo:v2.0.0 (more information : https://github.com/Papsy-ops/yolo.git)
   ```bash
   docker build -t your-dockerhub-username/frontend:v1.0.0 ./frontend #from client context
   docker build -t your-dockerhub-username/backend:v1.0.0 ./backend #from backend context
   docker push your-dockerhub-username/frontend:v1.0.0
   docker push your-dockerhub-username/backend:v1.0.0
   ```

3. **Apply Kubernetes Manifests**  
   Deploy the components in the following order to ensure dependencies are met:  
   ```bash
   kubectl apply -f k8s-manifests/mongo-statefulset.yaml
   kubectl apply -f k8s-manifests/mongo-service.yaml
   kubectl apply -f k8s-manifests/backend-deployment.yaml
   kubectl apply -f k8s-manifests/backend-service.yaml
   kubectl apply -f k8s-manifests/frontend-configmap.yaml
   kubectl apply -f k8s-manifests/frontend-deployment.yaml
   kubectl apply -f k8s-manifests/frontend-service.yaml
   kubectl apply -f k8s-manifests/ingress.yaml
   ```

4. **Verify Deployment**  
   Check pods status:  
   ```bash
   kubectl get pods
   ```  
   Check services and ingress:  
   ```bash
   kubectl get svc
   kubectl get ingress
   ```

5. **Access the Application**  
   Use the external IP address from the ingress to access the frontend UI. The frontend communicates with the backend API through the ingress `/api` path.

## Features

- **StatefulSet for MongoDB:** Ensures data persistence using Persistent Volumes.  
- **Ingress with NGINX:** Routes frontend and backend traffic via clean URL paths.  
- **ConfigMap:** Injects environment variables into the frontend at runtime.  
- **Docker Image Tagging:** Semantic versioning for clarity and version control.  
- **Kubernetes Best Practices:** Proper use of labels, annotations, and separation of concerns.

## Git Workflow

- Descriptive commits for every feature or fix.  
- Use of branches for feature development and merging to main.  
- Clear documentation with this README and explanation.md files.

## Troubleshooting

- Check pod logs if pods fail to start:  
  ```bash
  kubectl logs <pod-name>
  ```  
- Confirm persistent volumes are bound properly:  
  ```bash
  kubectl get pvc
  ```  
- Validate ingress rules and CORS configuration.

## License

This project is licensed under the MIT License.

## Author

Papetua Narina