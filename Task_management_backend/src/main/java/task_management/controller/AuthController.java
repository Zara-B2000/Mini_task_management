    // ...existing imports and class declaration...

// ...existing imports and class declaration...
package task_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import task_management.dto.UserDTO;
import task_management.security.JwtUtil;
import task_management.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        try {
            UserDTO saved = userService.register(userDTO);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO) {
        try {
            boolean success = userService.checkLogin(userDTO.getEmail(), userDTO.getPassword());
            if(!success) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Email or Password");

            String token = jwtUtil.generateToken(userDTO.getEmail());
            var existing = userService.getUserByEmail(userDTO.getEmail());

            Map<String,Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", new UserDTO(existing.getId(), existing.getUsername(), existing.getEmail(), existing.getRole()));

            return ResponseEntity.ok(response);

        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong: " + e.getMessage());
        }
    }
}