    // ...existing package and imports...
package task_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import task_management.entity.Task;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface TaskRepository extends JpaRepository<Task, Long> {
    long countByStatus(String status);
    long countByUserIdAndStatus(Long userId, String status);

    List<Task> findByStatus(String status);
    Page<Task> findByStatus(String status, Pageable pageable);
    Page<Task> findByUserIdAndStatus(Long userId, String status, Pageable pageable);

    List<Task> findByPriority(String priority);

    Page<Task> findAll(Pageable pageable);

    // New: Find tasks by user
    Page<Task> findByUserId(Long userId, Pageable pageable);
    List<Task> findByUserId(Long userId);
}