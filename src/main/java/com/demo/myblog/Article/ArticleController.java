package com.demo.myblog.Article;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/article")
@CrossOrigin
public class ArticleController {
    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private FavoriteRepository favoriteRepository;

    // 获取所有文章
    @GetMapping
    public List<Article> getAll() {
        return articleRepository.findAll();
    }

    // 发布新文章
    @PostMapping
    public Article create(@RequestBody Article article) {
        article.setCreateTime(LocalDateTime.now());
        return articleRepository.save(article);
    }

    // 获取文章详情
    @GetMapping("/{id}")
    public Article getById(@PathVariable Long id) {
        return articleRepository.findById(id).orElseThrow();
    }

    // 删除文章
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        articleRepository.deleteById(id);
    }

    // 获取文章评论
    @GetMapping("/{id}/comments")
    public List<Comment> getComments(@PathVariable Long id) {
        return commentRepository.findByArticleId(id);
    }

    // 发表评论
    @PostMapping("/{id}/comment")
    public Comment addComment(@PathVariable Long id, @RequestBody Comment comment) {
        comment.setArticleId(id);
        comment.setCreateTime(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    // 收藏文章
    @PostMapping("/{id}/favorite")
    public String favorite(@PathVariable Long id, @RequestParam String user) {
        List<Favorite> exists = favoriteRepository.findByArticleIdAndUser(id, user);
        if (exists.isEmpty()) {
            Favorite fav = new Favorite();
            fav.setArticleId(id);
            fav.setUser(user);
            favoriteRepository.save(fav);
            return "收藏成功";
        } else {
            favoriteRepository.deleteAll(exists);
            return "已取消收藏";
        }
    }

    // 获取用户收藏的文章id列表
    @GetMapping("/favorites")
    public List<Long> getFavorites(@RequestParam String user) {
        return favoriteRepository.findByUser(user).stream().map(Favorite::getArticleId).toList();
    }
} 