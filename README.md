# Project Setup Guide: BookInventory-DevOps

## Prerequisites

Before you begin, ensure you have the following installed on your Debian-based system:

- [Docker](https://docs.docker.com/get-docker/)
- [Minikube](https://minikube.sigs.k8s.io/docs/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [JDK 11+](https://openjdk.java.net/install/)
- [Maven](https://maven.apache.org/install.html) (for building the backend)
- [PostgreSQL Database URL](#using-pre-existing-database)

### Using Pre-existing Database

> **Note**: Ensure you have sufficient system resources (at least 4GB of RAM) to run Docker and Minikube.

---

## 1. Clone the GitHub Repository

First, clone the repository containing both the frontend and backend projects:

```bash
git clone git@github.com:LewKM/BookInventory-DevOps.git
```

Then, navigate to the project directory:

```bash
cd BookInventory-DevOps
```

Your folder structure should look like this:

``` bash
BookInventory-DevOps/
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── k8s/
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── ...
├── Dockerfile
└── README.md

---

---

## 2. Set Up Docker and Minikube

We will use Docker to containerize the application and Minikube to deploy it to a Kubernetes cluster locally.

### 2.1 Install and Start Minikube

Ensure Minikube is installed on your system. If it's not, follow the [installation guide](https://minikube.sigs.k8s.io/docs/).

Once installed, start Minikube:

```bash
minikube start
```

This will set up a local Kubernetes cluster using Minikube.

### 2.2 Set Docker Environment to Minikube

In order to use Docker within Minikube, set the Docker environment by running:

```bash
eval $(minikube -p minikube docker-env)
```

This command configures Docker to build images in the Minikube VM.

### 2.3 Build the Docker Image

Create a single `Dockerfile` that combines the frontend and backend setup.

**Dockerfile**:

```Dockerfile
# Backend Setup
FROM maven:3.8.4-openjdk-11-slim AS backend

WORKDIR /app
COPY ./src/backend/pom.xml ./src/backend/
RUN mvn -f ./src/backend/pom.xml clean package -DskipTests

# Frontend Setup
FROM node:16 AS frontend

WORKDIR /app
COPY ./src/frontend/package.json ./src/frontend/package-lock.json ./
RUN npm install
COPY ./src/frontend/ ./
RUN npm run build

# Final image for running both frontend and backend
FROM openjdk:11-jre-slim

# Backend
COPY --from=backend /app/src/backend/target/bookinventory-backend.jar /app/backend.jar

# Frontend
COPY --from=frontend /app/build /app/frontend

EXPOSE 8080 3000

# Command to run both frontend and backend
CMD ["sh", "-c", "java -jar /app/backend.jar & cd /app/frontend && npm start"]
```

Then, build the Docker image:

```bash
docker build -t bookinventory-app .
```

---

## 3. Set Up PostgreSQL Database

In this project, we use a pre-existing PostgreSQL database. The backend will connect to this database using the provided URL:

```bash
postgresql://bookinventory_db_owner:OeAkfx7qE3WM@ep-autumn-lake-a2dz3td7-pooler.eu-central-1.aws.neon.tech/bookinventory_db?sslmode=require
```

Ensure the backend service is configured to use this connection string in its `application.properties` or `application.yml` file.

---

## 4. Deploy to Minikube

### 4.1 Create Kubernetes Deployments

Inside the `k8s/` directory, create a single deployment file for both frontend and backend.

**bookinventory-deployment.yaml**:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookinventory
spec:
  replicas: 1
  selector:
    matchLabels:
      app: bookinventory
  template:
    metadata:
      labels:
        app: bookinventory
    spec:
      containers:
        - name: bookinventory
          image: bookinventory-app:latest
          ports:
            - containerPort: 8080
            - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: bookinventory
spec:
  selector:
    app: bookinventory
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
    - protocol: TCP
      port: 81
      targetPort: 3000
  type: LoadBalancer
```

### 4.2 Apply the Deployment to Minikube

Run the following command to deploy the application to Minikube:

```bash
kubectl apply -f k8s/bookinventory-deployment.yaml
```

### 4.3 Verify the Deployment

Check if the pod is running:

```bash
kubectl get pods
```

After the pod is running, you can access the frontend and backend services.

### 4.4 Expose the Service

Expose the service to access it from your local machine:

```bash
minikube service bookinventory --url
```

---

## 5. Testing the Application

Once the frontend and backend are deployed, you can open the provided Minikube URLs to test the application.

- **Frontend URL**: This is the URL where the frontend can be accessed.
- **Backend URL**: This URL is for accessing the backend API.

---

## 6. Clean Up

To clean up resources after testing or deployment, you can delete the deployments:

```bash
kubectl delete -f k8s/bookinventory-deployment.yaml
```

You can also stop Minikube with:

```bash
minikube stop
```

---

## Conclusion

Congratulations! You've successfully set up the **BookInventory-DevOps** project with a single Dockerfile for both frontend and backend on your local Debian machine using Docker and Minikube.

Feel free to reach out if you encounter any issues during the setup or deployment process. Happy coding!
