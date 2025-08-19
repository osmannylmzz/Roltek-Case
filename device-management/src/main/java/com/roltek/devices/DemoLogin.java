package com.roltek.devices;

import com.roltek.devices.model.User;
import com.roltek.devices.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DemoLogin implements CommandLineRunner {

    private final UserRepository users;
    private final PasswordEncoder pe;

    public DemoLogin(UserRepository users, PasswordEncoder pe) {
        this.users = users;
        this.pe = pe;
    }

    @Override
    public void run(String... args) {
        // aynı şifreyle iki demo kullanıcı
        ensureUser("demo@roltek.com",  "Demo1234!");
        ensureUser("demo2@roltek.com", "Demo1234!");
    }

    private User ensureUser(String email, String rawPassword) {
        return users.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setPasswordHash(pe.encode(rawPassword));
            return users.save(u);
        });
    }
}
