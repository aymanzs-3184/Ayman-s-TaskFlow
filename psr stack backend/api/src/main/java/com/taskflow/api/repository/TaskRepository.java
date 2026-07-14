package com.taskflow.api.repository;

import com.taskflow.api.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.assignee ORDER BY t.createdAt DESC")
    List<Task> findAllWithAssignee();

    List<Task> findByStatus(String status);
    List<Task> findByAssigneeId(Long assigneeId);

    Page<Task> findAll(Pageable pageable);

    @Query("SELECT t FROM Task t LEFT JOIN FETCH t.assignee " +
        "WHERE t.assignee.email = :email " +
        "ORDER BY t.createdAt DESC")
    List<Task> findByAssigneeEmail(@Param("email") String email);

    // Count tasks per user per status
    long countByAssigneeIdAndStatus(Long assigneeId, String status);
}