package com.service;


import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specifications;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.github.jhipster.service.QueryService;

import com.domain.DescricaoServico;
import com.domain.*; // for static metamodels
import com.repository.DescricaoServicoRepository;
import com.service.dto.DescricaoServicoCriteria;

import com.domain.enumeration.TipoServico;

/**
 * Service for executing complex queries for DescricaoServico entities in the database.
 * The main input is a {@link DescricaoServicoCriteria} which get's converted to {@link Specifications},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link DescricaoServico} or a {@link Page} of {@link DescricaoServico} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class DescricaoServicoQueryService extends QueryService<DescricaoServico> {

    private final Logger log = LoggerFactory.getLogger(DescricaoServicoQueryService.class);


    private final DescricaoServicoRepository descricaoServicoRepository;

    public DescricaoServicoQueryService(DescricaoServicoRepository descricaoServicoRepository) {
        this.descricaoServicoRepository = descricaoServicoRepository;
    }

    /**
     * Return a {@link List} of {@link DescricaoServico} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<DescricaoServico> findByCriteria(DescricaoServicoCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specifications<DescricaoServico> specification = createSpecification(criteria);
        return descricaoServicoRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link DescricaoServico} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<DescricaoServico> findByCriteria(DescricaoServicoCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specifications<DescricaoServico> specification = createSpecification(criteria);
        return descricaoServicoRepository.findAll(specification, page);
    }

    /**
     * Function to convert DescricaoServicoCriteria to a {@link Specifications}
     */
    private Specifications<DescricaoServico> createSpecification(DescricaoServicoCriteria criteria) {
        Specifications<DescricaoServico> specification = Specifications.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildSpecification(criteria.getId(), DescricaoServico_.id));
            }
            if (criteria.getNome() != null) {
                specification = specification.and(buildStringSpecification(criteria.getNome(), DescricaoServico_.nome));
            }
            if (criteria.getTipo() != null) {
                specification = specification.and(buildSpecification(criteria.getTipo(), DescricaoServico_.tipo));
            }
        }
        return specification;
    }

}
