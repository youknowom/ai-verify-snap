# Build stage
FROM maven:3.9.6-eclipse-temurin-17-jammy AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src
COPY mvnw .
COPY .mvn .mvn

# Build the application (skipping tests to speed up the build)
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-jammy

# Set the working directory
WORKDIR /app

# Copy the built jar file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Create a non-root user for security
RUN addgroup --system springgroup && adduser --system --ingroup springgroup springuser
RUN chown -R springuser:springgroup /app
USER springuser

# Render or deployment systems use the PORT environment variable to bind the web service
ENV PORT=8080
EXPOSE 8080

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT}/actuator/health || exit 1

# Run the jar file with dynamic port assignment support
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
