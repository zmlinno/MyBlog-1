package com.demo.myblog.Article;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(String user);
    List<Favorite> findByArticleIdAndUser(Long articleId, String user);
} 