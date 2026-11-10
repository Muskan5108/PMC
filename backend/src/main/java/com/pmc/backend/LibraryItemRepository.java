
package com.pmc.backend;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LibraryItemRepository
        extends JpaRepository<LibraryItem, Long> {

    List<LibraryItem> findByCategoryIgnoreCaseOrderByTitleAsc(
            String category);
}
