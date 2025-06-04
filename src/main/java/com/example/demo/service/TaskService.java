package com.example.demo.service;

import com.example.demo.model.Task;
import com.example.demo.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // 🔹 Créer une tâche
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // 🔹 Lire toutes les tâches
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // 🔹 Lire une tâche par ID
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    // 🔹 Mettre à jour une tâche
    public Task updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setTitle(updatedTask.getTitle());
                    task.setDescription(updatedTask.getDescription());
                    task.setStatus(updatedTask.getStatus());
                    return taskRepository.save(task);
                })
                .orElse(null);
    }

    // 🔹 Supprimer une tâche
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
