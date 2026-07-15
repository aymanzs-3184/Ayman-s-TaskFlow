# ── Stage 1: Build ──────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS build

# Set working directory inside container
WORKDIR /app

# Copy pom.xml first — Docker caches this layer
# Dependencies only re-download if pom.xml changes
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests

# ── Stage 2: Run ────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy only the JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port Spring runs on
EXPOSE 8080

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]