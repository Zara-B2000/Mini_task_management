
package task_management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import task_management.entity.Task;
import task_management.service.TaskService;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import task_management.repository.UserRepository;
import task_management.entity.User;
import java.util.HashMap;
import java.util.Map;

// ...existing imports...

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserRepository userRepository;

    // ✅ Pagination with status and role-based filtering
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/page/status/{status}")
    public Page<Task> getTasksByStatus(@PathVariable String status, Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if (user != null && user.getRole().equals("ADMIN")) {
            return taskService.getAllTasksByStatus(status, pageable);
        } else if (user != null) {
            return taskService.getTasksForUserByStatus(user.getId(), status, pageable);
        } else {
            return Page.empty();
        }
    }

    // ✅ Create task (ADMIN or USER)
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PostMapping("/create")
    public Task create(@RequestBody Task task) {
        // If user is not set in payload, set to authenticated user
        if (task.getUser() == null || task.getUser().getId() == null) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User user = userRepository.findByEmail(email);
            task.setUser(user);
        } else {
            // If user id is set, fetch and set the user entity
            User user = userRepository.findById(task.getUser().getId()).orElse(null);
            task.setUser(user);
        }
        return taskService.create(task);
    }


    // ✅ Pagination with role-based filtering
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/page")
    public Page<Task> getTasks(Pageable pageable) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        if (user != null && user.getRole().equals("ADMIN")) {
            return taskService.getAllTasks(pageable);
        } else if (user != null) {
            return taskService.getTasksForUser(user.getId(), pageable);
        } else {
            return Page.empty();
        }
    }

    // ✅ Filter by status
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/status/{status}")
    public List<Task> getByStatus(@PathVariable String status){
        return taskService.getByStatus(status);
    }

    // ✅ Filter by priority
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/priority/{priority}")
    public List<Task> getByPriority(@PathVariable String priority){
        return taskService.getByPriority(priority);
    }

    // ✅ Task counts by status for dashboard (role-aware)
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/counts")
    public Map<String, Long> getTaskCounts() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email);
        Map<String, Long> counts = new HashMap<>();
        if (user != null && user.getRole().equals("ADMIN")) {
            counts.put("TODO", taskService.countByStatus("TODO"));
            counts.put("IN_PROGRESS", taskService.countByStatus("IN_PROGRESS"));
            counts.put("DONE", taskService.countByStatus("DONE"));
            counts.put("TOTAL", taskService.countAll());
        } else if (user != null) {
            counts.put("TODO", taskService.countByUserIdAndStatus(user.getId(), "TODO"));
            counts.put("IN_PROGRESS", taskService.countByUserIdAndStatus(user.getId(), "IN_PROGRESS"));
            counts.put("DONE", taskService.countByUserIdAndStatus(user.getId(), "DONE"));
            counts.put("TOTAL", taskService.countByUserId(user.getId()));
        }
        return counts;
    }

    // ✅ Get all tasks with pagination (legacy, now role-based)
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/all")
public Page<Task> getAllTasks(Pageable pageable) {

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String email = authentication.getName();

    User user = userRepository.findByEmail(email);

    System.out.println("Logged email: " + email);
    System.out.println("User ID: " + user.getId());
    System.out.println("User Role: " + user.getRole());

    if (user != null && user.getRole().equals("ADMIN")) {
        return taskService.getAllTasks(pageable);
    } else if (user != null) {
        return taskService.getTasksForUser(user.getId(), pageable);
    }

    return Page.empty();

}

    // ✅ Get task by ID
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @GetMapping("/{id}")
    public Task getById(@PathVariable Long id) {
        return taskService.getById(id).orElse(null);
    }

    // ✅ Update task (ADMIN only)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public Task update(@PathVariable Long id, @RequestBody Task task) {
        return taskService.update(id, task).orElse(null);
    }

    // ✅ Delete task (ADMIN only)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        taskService.delete(id);
        return "Task deleted successfully";
    }
}