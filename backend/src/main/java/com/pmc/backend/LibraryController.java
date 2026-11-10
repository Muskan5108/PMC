
package com.pmc.backend;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/library")
@CrossOrigin(origins = "http://localhost:5173")
public class LibraryController {

    private final LibraryItemRepository repository;

    public LibraryController(LibraryItemRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<LibraryItem> getAllResources(
            @RequestParam(required = false) String category) {

        if (category != null && !category.isBlank()) {
            return repository
                    .findByCategoryIgnoreCaseOrderByTitleAsc(
                            category.trim());
        }

        return repository.findAll(
                org.springframework.data.domain.Sort
                        .by("title").ascending());
    }

    @PostMapping
    public ResponseEntity<?> addResource(
            @RequestBody LibraryItem item) {

        if (item.getTitle() == null || item.getTitle().isBlank()
                || item.getCategory() == null
                || item.getCategory().isBlank()) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of(
                            "message",
                            "Title and category are required."));
        }

        item.setTitle(item.getTitle().trim());
        item.setCategory(item.getCategory().trim());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(repository.save(item));
    }
}
