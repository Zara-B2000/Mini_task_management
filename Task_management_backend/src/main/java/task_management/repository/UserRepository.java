package task_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import task_management.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

}