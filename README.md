# BookInventory-DevOps

Here’s the README in proper Markdown (`.md`) code style:

```markdown
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

> **Note**: Ensure you have sufficient system resources (at least 4GB of RAM) to run Docker and Minikube.

---

## 1. Clone the GitHub Repository

The first step is to clone the repository that holds both the frontend and backend projects.

Open your terminal and run the following command:

```bash
git clone git@github.com:LewKM/BookInventory-DevOps.git
```

Navigate to the project directory:

```bash
cd BookInventory-DevOps
```

Your folder structure should look like this:

```bash
BookInventory-DevOps/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── pom.xml
│   └── ...
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── k8s/
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── ...
└── README.md
```

---

## 2. Set Up Docker and Minikube

We’ll be using Docker to containerize the application and Minikube to deploy it to a Kubernetes cluster locally.

### 2.1 Install and Start Minikube

Start by ensuring that Minikube is installed on your system. If it's not, you can install it by following the official guide [here](https://minikube.sigs.k8s.io/docs/).

Once installed, start Minikube:

```bash
minikube start
```

This will set up a local Kubernetes cluster using Minikube.

### 2.2 Set Docker Environment to Minikube

In order to use Docker within Minikube, you need to set the Docker environment. Run the following command to configure Docker to build images in the Minikube VM:

```bash
eval $(minikube -p minikube docker-env)
```

This command will configure the Docker CLI to use the Minikube Docker daemon.

### 2.3 Build the Docker Image for Backend

Navigate to the `backend/` directory and make sure you have the `Dockerfile` created, as shown earlier.

To build the Docker image for the backend:

```bash
docker build -t bookinventory-backend ./backend
```

This will build the Docker image for the backend. The image is tagged `bookinventory-backend`.

---

## 3. Set Up PostgreSQL Database

In this project, we use a pre-existing PostgreSQL database. You can use the database URL provided earlier to connect the backend to the database.

The URL is:

```bash
postgresql://bookinventory_db_owner:OeAkfx7qE3WM@ep-autumn-lake-a2dz3td7-pooler.eu-central-1.aws.neon.tech/bookinventory_db?sslmode=require
```

Ensure that the backend service is configured to use this URL. If needed, you can adjust the backend’s `application.properties` or `application.yml` file to reflect this connection string.

---

## 4. Deploy the Backend and Frontend to Minikube

### 4.1 Create the Kubernetes Deployment for the Backend

Create a `backend-deployment.yaml` file inside the `k8s/` directory to deploy the backend service on Minikube. You can use the following content:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookinventory-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: bookinventory-backend
  template:
    metadata:
      labels:
        app: bookinventory-backend
    spec:
      containers:
        - name: bookinventory-backend
          image: bookinventory-backend:latest
          ports:
            - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: bookinventory-backend
spec:
  selector:
    app: bookinventory-backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
```

### 4.2 Apply the Deployment to Minikube

Run the following command to deploy the backend to Minikube:

```bash
kubectl apply -f k8s/backend-deployment.yaml
```

### 4.3 Verify the Backend Deployment

After deploying the backend, check if the pod is running:

```bash
kubectl get pods
```

Once the pod is running, you can access the backend service.

### 4.4 Expose the Backend Service

To expose the backend service and make it accessible, run the following command:

```bash
minikube service bookinventory-backend --url
```

This will give you the URL where the backend service is accessible from your local machine.

---

## 5. Deploy the Frontend

Ensure that the frontend is set up correctly to communicate with the backend service. If the frontend requires API endpoint configurations (like the backend URL), make sure to update the frontend configuration files.

### 5.1 Build the Frontend Docker Image

Navigate to the `frontend/` directory and create a `Dockerfile` if it’s not already present:

```Dockerfile
# Use a Node.js image as base
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source files
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Command to run the frontend app
CMD ["npm", "start"]
```

Then, build the frontend Docker image:

```bash
docker build -t bookinventory-frontend ./frontend
```

### 5.2 Deploy the Frontend to Minikube

Create a `frontend-deployment.yaml` file inside the `k8s/` directory:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookinventory-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: bookinventory-frontend
  template:
    metadata:
      labels:
        app: bookinventory-frontend
    spec:
      containers:
        - name: bookinventory-frontend
          image: bookinventory-frontend:latest
          ports:
            - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: bookinventory-frontend
spec:
  selector:
    app: bookinventory-frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

Apply the frontend deployment:

```bash
kubectl apply -f k8s/frontend-deployment.yaml
```

### 5.3 Access the Frontend

After deploying the frontend, expose it using the following command:

```bash
minikube service bookinventory-frontend --url
```

---

## 6. Testing the Application

Once both the frontend and backend services are deployed, you can open the URLs provided by Minikube to test the application.

- **Frontend URL**: The URL to access the frontend.
- **Backend URL**: The URL for accessing the backend API.

---

## 7. Clean Up

To clean up resources after testing or deployment, you can delete the deployments with:

```bash
kubectl delete -f k8s/backend-deployment.yaml
kubectl delete -f k8s/frontend-deployment.yaml
```

You can also stop Minikube with:

```bash
minikube stop
```

---

## Conclusion

Congratulations! You’ve successfully set up the **BookInventory-DevOps** project on your local Debian machine using Docker and Minikube.

Feel free to reach out if you encounter any issues during the setup or deployment process. Happy coding!
