package com.taskflow.api.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.taskflow.api.dto.CreateTaskRequest;
import com.taskflow.api.dto.TaskDto;
import com.taskflow.api.model.Task;
import com.taskflow.api.model.User;
import com.taskflow.api.repository.TaskRepository;
import com.taskflow.api.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<TaskDto> getAllTasks() {
        return taskRepository.findAllWithAssignee()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public TaskDto createTask(CreateTaskRequest req) {
        Task.TaskBuilder builder = Task.builder()
                .title(req.getTitle())
                .priority(req.getPriority())
                .status("todo");

        // Only set assignee if assigneeId is provided
        if (req.getAssigneeId() != null) {
            User assignee = userRepository.findById(req.getAssigneeId())
                    .orElseThrow(() -> new RuntimeException("Assignee not found"));
            builder.assignee(assignee);
        }

        return toDto(taskRepository.save(builder.build()));
    }

    public TaskDto getTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return toDto(task);
    }

    public Page<TaskDto> getTasks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return taskRepository.findAll(pageable).map(this::toDto);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    private TaskDto toDto(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .assigneeName(task.getAssignee() != null
                        ? task.getAssignee().getName() : null)
                .assigneeId(task.getAssignee() != null
                        ? task.getAssignee().getId() : null)
                .createdAt(task.getCreatedAt())
                .build();
    }

    public TaskDto updateStatus(Long id, String status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        return toDto(taskRepository.save(task));
    }

    public List<TaskDto> getTasksForUser(String email) {
        return taskRepository.findByAssigneeEmail(email)
                .stream()
                .map(this::toDto)
                .toList();
    }

}