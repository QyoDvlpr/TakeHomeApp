FROM amazoncorretto:11
ADD target/TakeHomeApp-1.0-SNAPSHOT.war TakeHomeApp.war
ENTRYPOINT ["java","-jar","/TakeHomeApp.war"]
