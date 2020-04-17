package com.avc.takehome.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class ErrorController {

    @GetMapping("error")
    public String showErrorPage() {
        return "error";
    }
}
