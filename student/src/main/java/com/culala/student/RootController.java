package com.culala.student;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<?> root() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "Student Management REST API",
            "message", "Backend is running and connected to PostgreSQL database.",
            "available_endpoints", List.of("/culala/students", "/culala/students/{id}")
        ));
    }
}
