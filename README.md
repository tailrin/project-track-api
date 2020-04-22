# Project Tracker

By Joshua Hahn, Jay Sarmiento, Arit Oyekan, Lindsey Zylstra

[Project Tracker](https://project-tracker.now.sh)

This is a basic collaborative project tracker. All members of a given company will see the same data. Once you have created an account you can create projects and add tasks to track progress on a given project. There are two different roles for users. Administrators and standard users. Initially the only admin user will be the one who creates the company. When more users are added to the company the admin can change additional users to the admin role.

![Landing Page](/screenshots/login.png)
![Home Screen](/screenshots/home.png)
![Create Project Screen](/screenshots/addProject.png)
![Create Task Screen](/screenshots/addTask.png)

# Project Tracker API info

### All endpoints except for '/api/users' and '/api/auth/login/' and 'api/company' are protected endpoints and thus must have an 'Authorization' header

#### Create New Company Endpoint

[https://tranquil-mountain-91418.herokuapp.com/api/company](https://tranquil-mountain-91418.herokuapp.com/api/company)

Example

```
fetch('https://tranquil-mountain-91418.herokuapp.com/api/company', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `bearer "your bearer token here"`,
    },
    body: JSON.parse({
        company_name: "Company here"
    })
})
```

#### Create New User Endpoint

[https://tranquil-mountain-91418.herokuapp.com/api/users](https://tranquil-mountain-91418.herokuapp.com/api/users)

Example

```
fetch('https://tranquil-mountain-91418.herokuapp.com/api/users', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `bearer "your bearer token here"`,
    },
    body: JSON.parse({
        email: "email@here.com",
        full_name: "name here",
        password: "password here"
        isadmin: boolean value here
    })
})
```

### Login Endpoint

[https://tranquil-mountain-91418.herokuapp.com/api/auth/login](https://tranquil-mountain-91418.herokuapp.com/api/auth/login)

```
fetch('https://tranquil-mountain-91418.herokuapp.com/api/auth/login', {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `bearer "your bearer token here"`,
    },
    body: JSON.parse({
        email: "email@here.com",
        password: "password here"
    })
})
```

### Add or Get Projects Endpoint

[https://tranquil-mountain-91418.herokuapp.com/api/projects](https://tranquil-mountain-91418.herokuapp.com/api/projects)

Example

```
fetch('https://tranquil-mountain-91418.herokuapp.com/api/projects', {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: `bearer "your bearer token here"`,
    }
})
```

### Add or Get Tasks Enpoint

[https://tranquil-mountain-91418.herokuapp.com/api/tasks](https://tranquil-mountain-91418.herokuapp.com/api/tasks)

Example

```
fetch('https://tranquil-mountain-91418.herokuapp.com/api/tasks', {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: `bearer "your bearer token here"`,
    }
})
```

### Update Task Endpoint

[https://tranquil-mountain-91418.herokuapp.com/api/tasks/:id](https://tranquil-mountain-91418.herokuappcom/api/tasks/:id)

Example

```
fetch('https://tranquil-mountain-91418.herokuapp.com/api/tasks/1', {
    method: "Patch",
    headers: {
        "Content-Type": "application/json",
        Authorization: `bearer "your bearer token here"`,
    }
    body: JSON.parse({
        task_name: "task name",
        assignedto: user assigned id, (number)
        description: "description here",
        priority: "priority here",
        status: "status here",
        dateclosed: date closed here (date object)
    })
})
```

### Update Project Endpoint

[https://tranquil-mountain-91418.herokuapp.com/api/projects/:id](https://tranquil-mountain-91418.herokuapp.com/api/projects/:id)

Example

```
fetch('https://tranquil-mountain-91418.herokuapp.com/api/projects/1', {
    method: "Patch",
    headers: {
        "Content-Type": "application/json",
        Authorization: `bearer "your bearer token here"`,
    }
    body: JSON.parse({
        project_name,: "project name",
        description: "description here",
        duedate: due date here, (date object)
        priority: "priority here",
        status: "status here",
        dateclosed: date closed here (date object)
    })
})
```

### Update User Endpoint

[https://tranquil-mountain-91418.herokuapp.com/api/users/:id](https://tranquil-mountain-91418.herokuapp.com/api/users/:id)

Example

```
fetch('https://tranquil-mountain-91418.herokuapp.com/api/users/1', {
    method: "Patch",
    headers: {
        "Content-Type": "application/json",
        Authorization: `bearer "your bearer token here"`,
    }
    body: JSON.parse({
        full_name: "full name here",
        isadmin: boolean value here,
        email: "email here"
    })
})
```

## Tech Stack Used

#### JavaScript <img src="/tech-logos/javascript.png" height="50px" width="50px" alt="javscript logo"/>

### React <img src="/tech-logos/react.png" height="50px" width="50px" alt="react logo"/>

### Css <img src="/tech-logos/css.png" height="50px" width="50px" alt="css logo"/>

### PostgreSQL <img src="/tech-logos/postgre.jpeg" height="50px" width="50px" alt="postgresql logo"/>

### Nodejs <img src="/tech-logos/node.png" height="50px" width="50px" alt="nodejs logo"/>
