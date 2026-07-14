package com.taskflow.api.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
public class CreateTaskRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title too long")
    private String title;

    @NotBlank(message = "Priority is required")
    private String priority;

    private String description;

    private Long assigneeId; // ID of the user to assign — nullable
}