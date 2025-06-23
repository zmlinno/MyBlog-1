package com.demo.myblog.User;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin // 允许跨域，方便前端本地调试
public class UserController
{
    @Autowired
    private UserRepository userRepository;

    @PostMapping("register")
    public String register(@RequestBody User user)
    {
        if(userRepository.findByUsername(user.getUsername()) != null)
        {
            return"用户名已存在";
        }
        userRepository.save(user);
        return "注册成功";
    }



    //在这里是新加入的登录界面的后端代码
    @PostMapping("login")
    public String login(@RequestBody User user)
    {
        User existUser = userRepository.findByUsername(user.getUsername());
        if(existUser != null && existUser.getPassword().equals(user.getPassword()))
        {
            return"登录成功";
        }
        return"用户名或密码错误";
    }
}
