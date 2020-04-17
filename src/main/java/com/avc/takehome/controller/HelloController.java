package com.avc.takehome.controller;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.AWSLambdaClientBuilder;
import com.amazonaws.services.lambda.invoke.LambdaInvokerFactory;
import com.avc.takehome.service.HelloService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Controller
public class HelloController {

    @Value("${aws.access.key.id}")
    private String accessKey;

    @Value("${aws.access.secret.key}")
    private String secretKey;

    @Value("${aws.region}")
    private String awsRegion;

    @GetMapping("hello")
    public String showHelloPage(@RequestParam String username,
                                @RequestParam String token,
                                Map<String, Object> model) {

        BasicAWSCredentials credentials = new
                BasicAWSCredentials(accessKey, secretKey);

        Regions region = Regions.fromName(awsRegion);
        AWSLambdaClientBuilder clientBuilder = AWSLambdaClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(region);

        final HelloService helloService = LambdaInvokerFactory
                .builder()
                .lambdaClient(clientBuilder.build())
                .build(HelloService.class);

        model.put("message", helloService.getUsername(username));

        return "hello";
    }
}
