package com.taskflow.api.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String assigneeName;  // just the name, not the whole user
    private Long assigneeId;
    private LocalDateTime createdAt;
}