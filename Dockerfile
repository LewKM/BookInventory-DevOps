# ===== Backend Stage =====
FROM openjdk:17-jdk-slim as backend-build
WORKDIR /backend
COPY backend/ /backend/
RUN ./mvnw package -DskipTests

# ===== Frontend Stage =====
FROM node:22 as frontend-build
WORKDIR /frontend
COPY frontend/ /frontend/
RUN npm install
RUN npm run build

# ===== Final Stage =====
FROM nginx:alpine as production
# Copy Frontend Build to Nginx
COPY --from=frontend-build /frontend/build /usr/share/nginx/html

# Copy Backend JAR
WORKDIR /app
COPY --from=backend-build /backend/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose Ports
EXPOSE 80 8080

# Run Backend and Frontend
CMD ["sh", "-c", "java -jar /app/app.jar & nginx -g 'daemon off;'"]
