# Explanation of Kubernetes Deployment and Orchestration Choices

## 1. Choice of Kubernetes Objects for Deployment

For this project, the application is split into three main components: frontend, backend, and database. Each component is deployed using the appropriate Kubernetes objects to ensure scalability, availability, and maintainability:

- **Frontend and Backend** are deployed using **Deployments**. Deployments provide declarative updates for Pods and ReplicaSets, ensuring the desired number of replicas are always running, enabling rolling updates and rollbacks.
  
- The **Database (MongoDB)** is deployed using a **StatefulSet**. Unlike Deployments, StatefulSets provide stable, unique network identities and persistent storage for each pod. This is crucial for databases that require consistent storage and ordered deployment/termination, which helps avoid data loss and ensures reliable database operations.

## 2. Method Used to Expose Pods to Internet Traffic

- The frontend and backend services are exposed internally via **ClusterIP Services** to enable stable access within the cluster.
  
- To expose the application externally, an **Ingress** resource configured with the **NGINX Ingress Controller** is used. The Ingress routes external HTTP traffic to the frontend and backend based on URL paths (`/` for frontend and `/api` for backend). It also handles CORS settings to allow the frontend to communicate with the backend seamlessly.

This approach allows clean URL management, reduces the need for multiple public IPs, and provides a single point for TLS termination and traffic control.

## 3. Use or Lack of Persistent Storage

- Persistent storage is implemented for the MongoDB database using **PersistentVolumeClaims (PVCs)** bound to the StatefulSet pods. This ensures that data stored by the database persists beyond the lifecycle of individual pods.

- Because the database pods use persistent volumes, deleting or rescheduling pods does **not** lead to data loss, satisfying the requirement for durability and statefulness in the application.

- The frontend and backend are stateless, so they do not require persistent volumes.

## 4. Git Workflow Used

- The project follows a feature-branch workflow with multiple descriptive commits reflecting incremental steps in the deployment process.

- Each commit message clearly documents changes made, such as adding the MongoDB StatefulSet, configuring the Ingress, or updating service definitions.

- The `README.md` provides project setup and deployment instructions, while this `explanation.md` clarifies design choices.

- The use of tagged Docker images (e.g., `papetua/backend:v3.0.0`) ensures reproducibility and version control over container images.

## 5. Debugging and Troubleshooting Measures

- During deployment, logs from pods were inspected using `kubectl logs` to identify and resolve connectivity and configuration issues.

- Readiness and liveness probes were configured on backend and database pods to ensure application health monitoring.

- Ingress rules were tested and refined to handle CORS and path routing correctly.

- Persistent volume claims were monitored to ensure proper volume binding and data persistence.

## 6. Best Practices Followed

- Docker images are tagged with semantic versioning to track changes (`v3.0.1`, `v3.0.3`).

- Kubernetes manifests use labels and annotations to organize and manage resources effectively.

- Separation of concerns is maintained by using different manifests for deployments, services, configmaps, and ingress.

- Sensitive data like database credentials is expected to be managed securely via Kubernetes Secrets (not shown here).

- The folder structure is clean and logical, making the project easy to navigate and maintain.

---

**Summary:**  
This deployment leverages Kubernetes’ powerful orchestration capabilities by using StatefulSets for the database, Deployments for stateless services, Services for stable networking, and Ingress for external traffic management — all backed by persistent storage to ensure data durability. The Git workflow and Docker image tagging maintain clean version control and reproducibility.

---

