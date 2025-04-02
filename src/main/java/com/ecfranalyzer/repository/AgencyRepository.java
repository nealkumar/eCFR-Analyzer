package com.ecfranalyzer.repository;

import com.ecfranalyzer.model.Agency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AgencyRepository extends JpaRepository<Agency, String> {

    List<Agency> findByNameContainingIgnoreCase(String name);

    @Query("SELECT a FROM Agency a ORDER BY SIZE(a.titles) DESC")
    List<Agency> findAllOrderByTitleCountDesc();
}