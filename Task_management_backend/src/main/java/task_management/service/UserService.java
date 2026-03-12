
    package task_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import task_management.dto.UserDTO;
import task_management.entity.User;
import task_management.repository.UserRepository;

@Service
public class UserService {

    // Get all users
    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ Register
    public UserDTO register(UserDTO dto) {

        User user = new User();
        user.setUsername(dto.getUsername()); // map username
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole() != null ? dto.getRole().toUpperCase() : "USER");

        User saved = userRepository.save(user);

        return new UserDTO(saved.getId(), saved.getUsername(), saved.getEmail(), saved.getRole());
    }

    // ✅ Login check
    public boolean checkLogin(String email, String rawPassword) {
        User user = userRepository.findByEmail(email);
        return user != null && passwordEncoder.matches(rawPassword, user.getPassword());
    }

    // ✅ Get user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}