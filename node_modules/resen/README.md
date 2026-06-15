# Resen

The Resen a command-line HTTP client.

Simple command-line HTTP client.

GitHub:

* [https://github.com/andteki/resen.git](https://github.com/andteki/resen.git)

## Why

The HTTPie command is a very good program, but it cannot be installed with the npm package manager. What we have is not a command line program.

## Install

```cmd
npm i -g resen
```

After installation, we get a **res** command. Check:

```cmd
res --version
```

## Using

Methods that can be used:

* get
* post
* put
* patch
* delete

### Syntax

```cmd
res [method] <url> [params...]
```

### Examples

GET method:

```cmd
res http://localhost:8000/employees
```

```cmd
res localhost:8000/employees
```

```cmd
res :8000/employees
```

```cmd
res get localhost:8000/employees
```

POST method:

```cmd
res post localhost:8000/employees name='Steven' city='Szeged'
```

PUT method:

```cmd
res put localhost:8000/employees/1 name='Steven' city='Szeged'
```

PATCH method:

```cmd
res patch localhost:8000/employees/1 name='Steven' city='Szeged'
```

DELETE method:

```cmd
res delete localhost:8000/employees/1
```

## Authentication

Options:

* --auth-type bearer
* --auth token

* --auth-type digest
* --auth username:password

* --auth-type basic
* --auth username:password

Supported auth types:

* bearer
* digest
* basic

Using example:

```cmd
res delete localhost:8000/employees 
--auth-type bearer --auth f3a434...
```

Short form:

```cmd
res delete localhost:8000/employees 
-A bearer -a f3a434...
```

### Digest auhtentication example

```cmd
res localhost:8000/api/employees 
--auth-type digest --auth tom:secret
```

### Basic auhtentication example

```cmd
res localhost:8000/api/employees 
--auth-type digest --auth tom:secret
```
