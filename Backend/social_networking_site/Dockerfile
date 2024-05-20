
#
# Package stage
#

FROM openjdk:21-jdk-slim
COPY .env .env
COPY  /target/social_networking_site-0.0.1-SNAPSHOT.jar app.jar

# ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]




# Start with a base image containing Java runtime
#FROM openjdk:22-jdk-oracle
#
## The application's .jar file
#ARG JAR_FILE=target/sns-0.0.1-SNAPSHOT.jar
#
## Add the application's .jar to the container
#ADD ${JAR_FILE} app.jar
#
## Make port 8080 available to the world outside this container
#EXPOSE 8080
#
## Run the jar file
#ENTRYPOINT ["java","-jar","/app.jar"]