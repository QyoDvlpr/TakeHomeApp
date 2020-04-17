package com.avc.takehome.service;
import com.amazonaws.services.lambda.invoke.LambdaFunction;

public interface HelloService {

    @LambdaFunction(functionName = "HelloUser")
    public String getUsername(String username);
}
