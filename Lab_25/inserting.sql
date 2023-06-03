use lab_25;

insert into users(username, email, password, role)
    values  ('user1', 'user1@gmail.com','password1', 'Admin'),
            ('user2', 'user2@gmail.com','password2', 'User')

insert into repos(name, authorid)
    values ('C#', 1),
           ('Java', 1),
           ('NodeJS', 1),
           ('C++', 2),
           ('C', 2),
           ('ASM', 2)

insert into commits(message, repoid)
    values ('first commit', 1),
           ('second commit', 1),
           ('first commit', 2),
           ('second commit', 2),
           ('third commit', 2),
           ('first commit', 4),
           ('second commit', 4),
           ('third commit', 4),
           ('fourth commit', 4);

select * from repos;
select * from commits;