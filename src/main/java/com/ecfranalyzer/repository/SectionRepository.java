package com.ecfranalyzer.repository;

import com.ecfranalyzer.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, String> {

    List<Section> findByTitleId(String titleId);

    List<Section> findByTitleIdOrderByNumberAsc(String titleId);

    @Query("SELECT s FROM Section s WHERE s.title.id = :titleId ORDER BY s.wordCount DESC")
    List<Section> findByTitleIdOrderByWordCountDesc(@Param("titleId") String titleId);

    @Query("SELECT s FROM Section s WHERE s.heading LIKE %:keyword% OR s.number LIKE %:keyword%")
    List<Section> findByKeyword(@Param("keyword") String keyword);

    @Query("SELECT s FROM Section s JOIN s.changes c GROUP BY s ORDER BY COUNT(c) DESC")
    List<Section> findAllOrderByChangeCountDesc();
}