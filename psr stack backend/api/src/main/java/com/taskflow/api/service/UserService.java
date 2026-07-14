package com.taskflow.api.service;

import com.taskflow.api.dto.UserDto;
import com.taskflow.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> UserDto.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .todoCount((int) taskRepository
                            .countByAssigneeIdAndStatus(user.getId(), "todo"))
                        .inProgressCount((int) taskRepository
                            .countByAssigneeIdAndStatus(user.getId(), "inprogress"))
                        .doneCount((int) taskRepository
                            .countByAssigneeIdAndStatus(user.getId(), "done"))
                        .build())
                .toList();
    }
}