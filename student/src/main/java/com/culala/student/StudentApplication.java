package com.culala.student;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class StudentApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentApplication.class, args);
    }

    @Bean
    public CommandLineRunner initDatabase(StudentRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Student("Dodong", "Cruz", "IT", "3A"));
                repository.save(new Student("Phillip Rae", "Culala", "IT", "WMD 3A"));
                repository.save(new Student("Rico", "Blanco", "IT", "2A"));
                repository.save(new Student("Raymund", "Marasigan", "IT", "4A"));
                System.out.println(">>> Database initialized with sample students! <<<");
            }
        };
    }

}
