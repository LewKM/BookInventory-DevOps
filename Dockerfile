# ===== Backend Build Stage =====
FROM eclipse-temurin:17-jdk-slim as backend-build
WORKDIR /backend
COPY backend/ /backend/
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# ===== Frontend Build Stage =====
FROM node:22 as frontend-build
WORKDIR /frontend
COPY frontend/ /frontend/
RUN npm install && npm run build

# ===== Final Stage =====
FROM nginx:alpine as production

# Install additional tools (optional, for debugging or future-proofing)
RUN apk add --no-cache bash curl

# Copy Frontend Build to Nginx HTML Directory
COPY --from=frontend-build /frontend/build /usr/share/nginx/html

# Copy Backend JAR to the App Directory
WORKDIR /app
COPY --from=backend-build /backend/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Configure Nginx to Proxy API Requests
COPY backend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose Ports
EXPOSE 80 8080

# Start Backend and Frontend
CMD ["sh", "-c", "java -jar /app/app.jar & nginx -g 'daemon off;'"]
