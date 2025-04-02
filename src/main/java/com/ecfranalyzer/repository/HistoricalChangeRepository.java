package com.ecfranalyzer.repository;

import com.ecfranalyzer.model.HistoricalChange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HistoricalChangeRepository extends JpaRepository<HistoricalChange, Long> {

    // Basic finder methods
    List<HistoricalChange> findBySectionId(String sectionId);

    // Simple JPQL queries that don't do complex aggregations
    @Query("SELECT h FROM HistoricalChange h JOIN h.section s JOIN s.title t WHERE t.id = :titleId")
    List<HistoricalChange> findByTitleId(@Param("titleId") String titleId);

    @Query("SELECT h FROM HistoricalChange h JOIN h.section s JOIN s.title t JOIN t.agency a WHERE a.id = :agencyId")
    List<HistoricalChange> findByAgencyId(@Param("agencyId") String agencyId);

    List<HistoricalChange> findByErrorOccurredBetween(LocalDate startDate, LocalDate endDate);
}