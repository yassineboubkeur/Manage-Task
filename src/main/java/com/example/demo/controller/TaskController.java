package com.example.demo.controller;

import com.example.demo.model.Task;
import com.example.demo.model.User;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    // جلب المهام ديال المستخدم اللي داخل فقط
    @GetMapping
    public List<Task> getAllTasks(Principal principal) {
        String username = principal.getName();
        return taskRepository.findByUserUsername(username);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task, Principal principal) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username);

        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        task.setUser(user);
        Task saved = taskRepository.save(task);
        return ResponseEntity.status(201).body(saved);
    }

    // تعديل مهمة (نتأكد أنها ديال المستخدم اللي داخل)
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails, Principal principal) {
        String username = principal.getName();

        Task task = taskRepository.findById(id).orElse(null);
        if (task == null || !task.getUser().getUsername().equals(username)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        Task updated = taskRepository.save(task);
        return ResponseEntity.ok(updated);
    }

    // حذف مهمة (نتأكد أنها ديال المستخدم اللي داخل)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Principal principal) {
        String username = principal.getName();

        Task task = taskRepository.findById(id).orElse(null);
        if (task == null || !task.getUser().getUsername().equals(username)) {
            return ResponseEntity.status(403).build();
        }

        taskRepository.delete(task);
        return ResponseEntity.noContent().build();
    }
}