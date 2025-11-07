package com.batuhan.notes.backend.controller;

import com.batuhan.notes.backend.entity.NoteEntity;
import com.batuhan.notes.backend.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping("/create")
    public NoteEntity createNote(@RequestBody NoteEntity noteEntity) {
        return noteService.saveNote(noteEntity);
    }

    @GetMapping("/all")
    public List<NoteEntity> getAllNotes() {
        return noteService.findAllNotes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteEntity> getNotesById(@PathVariable Long id) {
        return noteService.findNoteById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<NoteEntity> updateNote(@PathVariable Long id, @RequestBody NoteEntity noteDetails) {
        return noteService.findNoteById(id)
                .map(existingNote -> {
                    existingNote.setTitle(noteDetails.getTitle());
                    existingNote.setContent(noteDetails.getContent());
                    existingNote.setCompleted(noteDetails.isCompleted());

                    NoteEntity updatedNote = noteService.saveNote(existingNote);
                    return ResponseEntity.ok(updatedNote);
                }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/deleteId/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        if (noteService.findNoteById(id).isPresent()) {
            noteService.deleteNote(id);
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.notFound().build();
    }
}