FROM amazoncorretto:11
ADD target/TakeHomeApp-1.0-SNAPSHOT.jar TakeHomeApp.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/TakeHomeApp.jar"]
