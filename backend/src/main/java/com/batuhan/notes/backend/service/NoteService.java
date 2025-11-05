package com.batuhan.notes.backend.service;

import com.batuhan.notes.backend.entity.NoteEntity;
import com.batuhan.notes.backend.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;

    public NoteEntity saveNote(NoteEntity noteEntity) {
        noteEntity.setUpdatedAt(System.currentTimeMillis());

        if (noteEntity.getId() == null) {
            noteEntity.setCreatedAt(System.currentTimeMillis());
        }

        return noteRepository.save(noteEntity);
    }

    public List<NoteEntity> findAllNotes() {
        return noteRepository.findAll();
    }

    public Optional<NoteEntity> findNoteById(Long id) {
        return noteRepository.findById(id);
    }

    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }
}