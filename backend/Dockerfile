# Build stage
FROM maven:3.9.11-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre

# Install curl for health check
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Create a non-root user for security (Debian-compatible syntax)
RUN groupadd --system springgroup \
    && useradd --system --gid springgroup --no-create-home springuser
RUN chown -R springuser:springgroup /app
USER springuser

# Render or deployment systems use the PORT environment variable to bind the web service
ENV PORT=8080
EXPOSE 8080

# Add healthcheck using curl (now installed)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD curl -f http://localhost:${PORT}/actuator/health || exit 1

# Run the jar file with dynamic port assignment support
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
