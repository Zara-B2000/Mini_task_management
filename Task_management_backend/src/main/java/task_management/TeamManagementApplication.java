package task_management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "task_management.entity")
@EnableJpaRepositories(basePackages = "task_management.repository")
public class TeamManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(TeamManagementApplication.class, args);
	}
}