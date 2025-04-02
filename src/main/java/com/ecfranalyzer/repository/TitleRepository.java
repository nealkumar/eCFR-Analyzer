package com.ecfranalyzer.repository;

import com.ecfranalyzer.model.Title;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TitleRepository extends JpaRepository<Title, String> {

    // Basic finder methods
    List<Title> findByAgencyId(String agencyId);

    List<Title> findByNameContainingIgnoreCase(String name);

    // Make sure this matches your entity property name
    Title findByTitleNumber(String number);

    // Simple ordering queries
    List<Title> findAllByOrderByWordCountDesc();

    @Query("SELECT t FROM Title t WHERE t.agency.id = :agencyId ORDER BY t.wordCount DESC")
    List<Title> findByAgencyIdOrderByWordCountDesc(@Param("agencyId") String agencyId);
}