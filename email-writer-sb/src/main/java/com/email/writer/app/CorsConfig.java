package com.email.writer.app.config;   // <-- change based on your package

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {

                registry.addMapping("/api/**")
                        .allowedOrigins(
                                "https://mail.google.com",
                                "chrome-extension://ifkpmbefpnbfepmicljblbionamggekb"
                        )
                        .allowedMethods("*")
                        .allowedHeaders("*");
            }
        };
    }
}
