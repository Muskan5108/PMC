
package com.pmc.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LibraryDataInitializer {

    @Bean
    CommandLineRunner seedLibrary(LibraryItemRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }

            repository.save(new LibraryItem(
                "Introduction to Vaani",
                "Vaani",
                "An introductory entry for approved Vaani learning resources.",
                "Hindi",
                null
            ));

            repository.save(new LibraryItem(
                "Vaani Teeka",
                "Teeka",
                "A place to organize approved Vaani explanations and commentary.",
                "Hindi",
                null
            ));

            repository.save(new LibraryItem(
                "Beetak Saheb",
                "Beetak",
                "A collection entry for approved Beetak Saheb study resources.",
                "Hindi",
                null
            ));

            repository.save(new LibraryItem(
                "Charchani",
                "Charchani",
                "A place for approved Charchani discussions and learning videos.",
                "Hindi",
                null
            ));
        };
    }
}
