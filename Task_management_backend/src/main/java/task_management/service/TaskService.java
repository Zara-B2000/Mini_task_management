    // Count tasks by status (ADMIN)
package task_management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import task_management.entity.Task;
import task_management.repository.TaskRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

// ...existing code...

// ...existing code...

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // Paginated tasks by status (ADMIN)
    public Page<Task> getAllTasksByStatus(String status, Pageable pageable) {
        return taskRepository.findByStatus(status, pageable);
    }

    // Paginated tasks by status for a user
    public Page<Task> getTasksForUserByStatus(Long userId, String status, Pageable pageable) {
        return taskRepository.findByUserIdAndStatus(userId, status, pageable);
    }


    // New: Get tasks for a specific user (paginated)
    public Page<Task> getTasksForUser(Long userId, Pageable pageable) {
        return taskRepository.findByUserId(userId, pageable);
    }

    // New: Get all tasks for a specific user (not paginated)
    public List<Task> getTasksForUser(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    // Create Task
    public Task create(Task task) {
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    // Pagination
    public Page<Task> getAllTasks(Pageable pageable){
        return taskRepository.findAll(pageable);
    }

    // Count tasks by status (ADMIN)
    public long countByStatus(String status) {
        return taskRepository.countByStatus(status);
    }

    // Count tasks by user and status (USER)
    public long countByUserIdAndStatus(Long userId, String status) {
        return taskRepository.countByUserIdAndStatus(userId, status);
    }

    // Count all tasks for a user (USER)
    public long countByUserId(Long userId) {
        return taskRepository.findByUserId(userId).size();
    }

    // Count all tasks (ADMIN)
    public long countAll() {
        return taskRepository.count();
    }

    // Filter by Status
    public List<Task> getByStatus(String status){
        return taskRepository.findByStatus(status);
    }

    // Filter by Priority
    public List<Task> getByPriority(String priority){
        return taskRepository.findByPriority(priority);
    }

    // Get All Tasks
    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    // Get Task by ID
    public Optional<Task> getById(Long id) {
        return taskRepository.findById(id);
    }

    // Update Task
    public Optional<Task> update(Long id, Task updatedTask) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setStatus(updatedTask.getStatus());
            task.setPriority(updatedTask.getPriority());
            task.setDueDate(updatedTask.getDueDate());
            task.setUpdatedAt(LocalDateTime.now());
            return taskRepository.save(task);
        });
    }

    // Delete Task
    public void delete(Long id) {
        taskRepository.deleteById(id);
    }
}