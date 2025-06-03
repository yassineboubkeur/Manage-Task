package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class DatabaseCheckRunner implements CommandLineRunner {

    private final DataSource dataSource;

    public DatabaseCheckRunner(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            System.out.println("✅ Database is up and running! Connection successful.");
        } catch (Exception e) {
            System.err.println("❌ Failed to connect to the database:");
            e.printStackTrace();
        }
    }
}
