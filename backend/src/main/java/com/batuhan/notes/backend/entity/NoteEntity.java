package com.batuhan.notes.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private boolean completed = false;

    private Long createdAt = System.currentTimeMillis();
    private Long updatedAt = System.currentTimeMillis();
}