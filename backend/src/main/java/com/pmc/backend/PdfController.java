
package com.pmc.backend;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pdfs")
@CrossOrigin(origins = "http://localhost:5173")
public class PdfController {

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> viewPdf(
            @PathVariable String filename) throws IOException {

        // Allow Unicode filenames, but reject unsafe path characters.
        if (filename == null
                || !filename.toLowerCase().endsWith(".pdf")
                || filename.contains("/")
                || filename.contains("\\")
                || filename.contains("..")) {
            return ResponseEntity.badRequest().build();
        }

        Resource pdf = new ClassPathResource(
                "static/pdfs/" + filename);

        if (!pdf.exists() || !pdf.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        String encodedFilename = java.net.URLEncoder
                .encode(filename, StandardCharsets.UTF_8)
                .replace("+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "inline; filename*=UTF-8''" + encodedFilename
                )
                .body(pdf);
    }
}
