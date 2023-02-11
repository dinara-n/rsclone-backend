**Get Users**
----
Returns json data about users.\
Возвращает json с данными о пользователях.

<details>

* **URL**

    /users

* **Method:**

    `GET`

* **Headers:**
    
    `'Authorization': 'Bearer [access-token]'`

    Is inserted into requests automatically by an axios interceptor.\
    Вставляется в запросы автоматически.

*  **URL Params**

    None

* **Query Params**

    **Optional:**

    `archived=true`

    If `archived=true` param is passed, api returns json with archived (deleted) users.\
    Если передан параметр `?archived=true`, апи вернет json с удаленными пользователями.

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      [
        {
          "data": {
              "firstName": "B",
              "patronymic": "B",
              "surname": "B",
              "birthday": "1989-12-08",
              "mail": "b@gmail.com",
              "phone": "+777"
          },
          "_id": "63e37f2578e976f7eec632ea",
          "role": "manager",
          "companies": [],
          "todos": [],
          "id": "63e37f2578e976f7eec632ea"
        }
      ]
    ```
 
* **Error Response:**

    None

* **Notes:**

    None

</details>

**Add user**
----
Creates a new user.\
Создает нового пользователя.

<details>

* **URL**

    /users

* **Method:**

    `POST`

* **Headers:**

    `'Authorization': 'Bearer [access-token]'`

    Is inserted into requests automatically by an axios interceptor.\
    Вставляется в запросы автоматически.

    `'Content-Type': 'application/json'`

*  **URL Params**

    None

* **Query Params**

    None

* **Data Params**

    ```json
      {
        "data": {
            "firstName": "I",
            "patronymic": "I",
            "surname": "I",
            "birthday": "1985-12-03",
            "mail": "i@gmail.com",
            "phone": "+777",
            "password": "123321123"
        },
        "role": "salesman",
        "settings" : {
          "language": "ru"
        }
      }
    ```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
        "newUser": {
            "data": {
                "firstName": "I",
                "patronymic": "I",
                "surname": "I",
                "birthday": "1985-12-03",
                "mail": "i@gmail.com",
                "phone": "+777",
                "password": "123321123"
            },
            "role": "salesman",
            "settings": {
                "language": "ru"
            }
        }
      }
    ```
 
* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />

    * **Code:** 401 UNAUTHORIZED <br />

    * **Code:** 403 FORBIDDEN <br />

* **Notes:**

    All fields except 'settings' are required. Accepted roles: 'manager', 'salesman'. Mail should be unique and a correct email. Password should be at least 8 symbols long.\
    Все поля кроме 'settings' обязательны. Поле mail должно быть уникальным и в правильном формате. Пароль должнен быть длиной не менее 8 символов.
</details>

**Update user**
----
Updates attributes of specified user.\
Обновляет данные указанного пользователя.

<details>

* **URL**

    /users/:id

* **Method:**

    `PATCH`

* **Headers:**

    `'Authorization': 'Bearer [access-token]'`

    Is inserted into requests automatically by an axios interceptor.\
    Вставляется в запросы автоматически.

    `'Content-Type': 'application/json'`

*  **URL Params**

    **Required:**

    `id=[string]`

* **Query Params**

    None

* **Data Params**

    ```json
      {
        "data": {
            "firstName": "Iii"
        }
      }
    ```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
        "updatedData": {
            "data": {
                "firstName": "Iii"
            },
            "_id": "63e77d56d2a812a80b9987af"
        }
      }
    ```
 
* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />

    * **Code:** 401 UNAUTHORIZED <br />

    * **Code:** 403 FORBIDDEN <br />

    * **Code:** 404 NOT FOUND <br />

* **Notes:**

    None

</details>

**Delete User**
----
Mark specified user as 'archived'.\
Помечает указанного пользователя удаленным ('archived').

<details>

* **URL**

    /users/:id

* **Method:**

    `DELETE`

* **Headers:**

    `'Authorization': 'Bearer [access-token]'`

    Is inserted into requests automatically by an axios interceptor.\
    Вставляется в запросы автоматически.

*  **URL Params**

    **Required:**
 
    `id=[string]`

* **Query Params**

    None

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
        "deletedUser": {
          "data": {
            "firstName": "Iii",
            "patronymic": "Ii",
            "surname": "Ii",
            "birthday": "1985-12-03",
            "mail": "ii@gmail.com",
            "phone": "+777",
            "password": "$2a$05$xhYMhvNaf7FB3.Bw422rG.ys3eYL.MrIKHmw4wyPAyIWfcBtVUIdG"
          },
          "settings": {
            "language": "ru"
          },
          "_id": "63e77d56d2a812a80b9987af",
          "role": "salesman",
          "archived": false,
          "__v": 0,
          "id": "63e77d56d2a812a80b9987af"
        }
      }
    ```

* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />

    * **Code:** 401 UNAUTHORIZED <br />

    * **Code:** 403 FORBIDDEN <br />

    * **Code:** 404 NOT FOUND <br />

* **Notes:**

    None

</details>

**Undelete user**
----
Mark specified user as not 'archived'.\
Помечает указанного пользователя не удаленным.

<details>

* **URL**

    /users/archived/:id

* **Method:**

    `PATCH`

* **Headers:**

    `'Authorization': 'Bearer [access-token]'`

    Is inserted into requests automatically by an axios interceptor.\
    Вставляется в запросы автоматически.

    `'Content-Type': 'application/json'`

*  **URL Params**

    **Required:**

    `id=[string]`

* **Query Params**

    None

* **Data Params**

    ```json
      {
        "archived": false
      }
    ```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
        "undeletedUser": {
            "data": {
                "firstName": "Iii",
                "patronymic": "Ii",
                "surname": "Ii",
                "birthday": "1985-12-03",
                "mail": "ii@gmail.com",
                "phone": "+777",
                "password": "$2a$05$xhYMhvNaf7FB3.Bw422rG.ys3eYL.MrIKHmw4wyPAyIWfcBtVUIdG"
            },
            "settings": {
                "language": "ru"
            },
            "_id": "63e77d56d2a812a80b9987af",
            "role": "salesman",
            "archived": true,
            "__v": 0,
            "id": "63e77d56d2a812a80b9987af"
        }
      }
    ```
 
* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />

    * **Code:** 401 UNAUTHORIZED <br />

    * **Code:** 403 FORBIDDEN <br />

    * **Code:** 404 NOT FOUND <br />

* **Notes:**

    None

</details>

**Get Companies**
----
Returns json data about companies.\
Возвращает json с данными о компаниях.

<details>

* **URL**

    /companies

* **Method:**

    `GET`

* **Headers:**
    
    `'Authorization': 'Bearer [access-token]'`

    Is inserted into requests automatically by an axios interceptor.\
    Вставляется в запросы автоматически.

*  **URL Params**

    None

* **Query Params**

    **Optional:**

    `archived=true`

    If `archived=true` param is passed, api returns json with archived (deleted) companies.\
    Если передан параметр `?archived=true`, апи вернет json с удаленными компаниями.

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      [
        {
          "data": {
              "firstName": "B",
              "patronymic": "B",
              "surname": "B",
              "birthday": "1989-12-08",
              "mail": "b@gmail.com",
              "phone": "+777"
          },
          "_id": "63e37f2578e976f7eec632ea",
          "role": "manager",
          "companies": [],
          "todos": [],
          "id": "63e37f2578e976f7eec632ea"
        }
      ]
    ```
 
* **Error Response:**

    None

* **Notes:**

    None

</details>

**Add company**
----
Creates a new company.\
Создает новую компания.

<details>

* **URL**

    /companies

* **Method:**

    `POST`

* **Headers:**

    `'Authorization': 'Bearer [access-token]'`

    Is inserted into requests automatically by an axios interceptor.\
    Вставляется в запросы автоматически.

    `'Content-Type': 'application/json'`

*  **URL Params**

    None

* **Query Params**

    None

* **Data Params**

    ```json
      {
        "data": {
            "companyName": "CF",
            "inn": 1234567893,
            "address": "address"
        },
        "contacts": {
            "commonPhone": [
                "+777"
            ],
            "commonMail": "cf@gmail.com",
            "workers": [
                {
                    "firstName": "CFA",
                    "patronymic": "CFA",
                    "surname": "CFA",
                    "birthday": "1989-04-08",
                    "mail": "cfa@gmail.com",
                    "phone": [
                        "+777"
                    ]
                }
            ]
        },
        "users": [
            "63e37f79609334e79cd043d9"
        ]
      }
    ```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
        "newCompany": {
            "data": {
                "companyName": "CF",
                "inn": 1234567893,
                "address": "address"
            },
            "contacts": {
                "commonPhone": [
                    "+777"
                ],
                "commonMail": "cf@gmail.com",
                "workers": [
                    {
                        "firstName": "CFA",
                        "patronymic": "CFA",
                        "surname": "CFA",
                        "birthday": "1989-04-08",
                        "mail": "cfa@gmail.com",
                        "phone": [
                            "+777"
                        ],
                        "_id": "63e789a0d6f1b265be916f22"
                    }
                ]
            },
            "users": [
                "63e37f79609334e79cd043d9"
            ],
            "archived": false,
            "_id": "63e789a0d6f1b265be916f21",
            "__v": 0,
            "id": "63e789a0d6f1b265be916f21"
        }
      }
    ```
 
* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />

    * **Code:** 401 UNAUTHORIZED <br />

    * **Code:** 403 FORBIDDEN <br />

* **Notes:**

    Company name is required. Either commonPhone or mail are required. Mail should be unique and a correct email.\
    Название компании обязательно. Обязателен телефон или mail компании (можно одно из двух). Поле mail должно быть уникальным и в правильном формате.
</details>

**Update company**
----
Updates attributes of a specified company.\
Обновляет данные указанной компании.

<details>

* **URL**

    /companies/:id

* **Method:**

    `PATCH`

* **Headers:**

    `'Authorization': 'Bearer [access-token]'`

    Is inserted into requests automatically by an axios interceptor.\
    Вставляется в запросы автоматически.

    `'Content-Type': 'application/json'`

*  **URL Params**

    **Required:**

    `id=[string]`

* **Query Params**

    None

* **Data Params**

    ```json
      {
        "data": {
            "companyName": "CFf"
        },
        "contacts": {
            "workers": [
                {
                    "firstName": "CFAa"
                }
            ]
        },
        "users": [
            "63e37f79609334e79cd043d9"
        ]
      }
    ```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
        "updatedData": {
            "data": {
                "companyName": "CFf"
            },
            "contacts": {
                "workers": [
                    {
                        "firstName": "CFAa"
                    }
                ]
            },
            "users": [
                "63e37f79609334e79cd043d9"
            ]
        }
      }
    ```
 
* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />

    * **Code:** 401 UNAUTHORIZED <br />

    * **Code:** 403 FORBIDDEN <br />

    * **Code:** 404 NOT FOUND <br />

* **Notes:**

    None

</details>

**Delete Company**
----
Mark specified company as 'archived'.\
Помечает указанную компанию удаленной ('archived').

<details>

* **URL**

    /companies/:id

* **Method:**

    `DELETE`

* **Headers:**

    `'Authorization': 'Bearer [access-token]'`

    Is inserted into requests automatically by an axios interceptor.\
    Вставляется в запросы автоматически.

*  **URL Params**

    **Required:**
 
    `id=[string]`

* **Query Params**

    None

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
        "deletedCompany": {
            "data": {
                "companyName": "CE",
                "inn": 1234567892,
                "address": "address"
            },
            "contacts": {
                "commonPhone": [
                    "+777"
                ],
                "commonMail": "ce@gmail.com",
                "workers": [
                    {
                        "firstName": "CEA",
                        "patronymic": "CEA",
                        "surname": "CEA",
                        "birthday": "1988-01-02",
                        "mail": "cea@gmail.com",
                        "phone": [
                            "+777"
                        ],
                        "_id": "63e6a2f8a36dfd3f59501f01"
                    }
                ]
            },
            "_id": "63e6a2f8a36dfd3f59501f00",
            "users": [
                "63e37f79609334e79cd043d9"
            ],
            "archived": false,
            "__v": 0,
            "id": "63e6a2f8a36dfd3f59501f00"
        }
      }
    ```

* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />

    * **Code:** 401 UNAUTHORIZED <br />

    * **Code:** 403 FORBIDDEN <br />

    * **Code:** 404 NOT FOUND <br />

* **Notes:**

    None

</details>

**Undelete company**
----
Mark specified company as not 'archived'.\
Помечает указанную компанию не удаленной.

<details>

* **URL**

    /companies/archived/:id

* **Method:**

    `PATCH`

* **Headers:**

    `'Authorization': 'Bearer [access-token]'`

    Is inserted into requests automatically by an axios interceptor.\
    Вставляется в запросы автоматически.

    `'Content-Type': 'application/json'`

*  **URL Params**

    **Required:**

    `id=[string]`

* **Query Params**

    None

* **Data Params**

    ```json
      {
        "archived": false
      }
    ```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
        "undeleteCompany": {
            "data": {
                "companyName": "CE",
                "inn": 1234567892,
                "address": "address"
            },
            "contacts": {
                "commonPhone": [
                    "+777"
                ],
                "commonMail": "ce@gmail.com",
                "workers": [
                    {
                        "firstName": "CEA",
                        "patronymic": "CEA",
                        "surname": "CEA",
                        "birthday": "1988-01-02",
                        "mail": "cea@gmail.com",
                        "phone": [
                            "+777"
                        ],
                        "_id": "63e6a2f8a36dfd3f59501f01"
                    }
                ]
            },
            "_id": "63e6a2f8a36dfd3f59501f00",
            "users": [
                "63e37f79609334e79cd043d9"
            ],
            "archived": true,
            "__v": 0,
            "id": "63e6a2f8a36dfd3f59501f00"
        }
      }
    ```
 
* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />

    * **Code:** 401 UNAUTHORIZED <br />

    * **Code:** 403 FORBIDDEN <br />

    * **Code:** 404 NOT FOUND <br />

* **Notes:**

    None

</details>

**Get Todos**
----
Returns json data about todos.\
Возвращает json с данными о задачах.

<details>

* **URL**

    /todos

* **Method:**

    `GET`

* **Headers:**
    
    `'Authorization': 'Bearer [access-token]'`

    Is inserted into requests automatically by an axios interceptor.\
    Вставляется в запросы автоматически.

*  **URL Params**

    None

* **Query Params**

    **Optional:**

    `range=month&date=2023-02`

    If `range=month` param is passed, api returns json with complete, missed and future tasks count by days for the specified month. If 'date' param is not passed, current month will be used.\
    Если передан параметр `range=month`, апи вернет json с количеством завершенных, пропущенных и будущих задач по дням за указанный месяц. Если параметр 'date' не передан, возьмется текущий месяц.

    `range=day&date=2023-02-11`

    If `range=day` param is passed, api returns json with todos for the specified day and column number for those todos. If 'date' param is not passed, current date will be used.\
    Если передан параметр `range=day`, апи вернет json с задачами за указанный день и номером колонки задачи. Если параметр 'date' не передан, возьмется текущая дата.

    If query params are not passed, api will return all tasks.\
    Если query-параметры не указаны, вернется список задач за все время.

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      [
        {
          "data": {
              "type": "common",
              "startTime": "2023-02-09T08:00",
              "endTime": "2023-02-09T09:30",
              "title": "заголовок таска",
              "text": "тело таска"
          },
          "_id": "63e3edd4079d257910bc50ca",
          "isDone": true,
          "company": {
              "data": {
                  "companyName": "CB"
              },
              "contacts": {
                  "workers": [
                      {
                          "firstName": "CBA",
                          "patronymic": "CBA",
                          "surname": "CBA"
                      },
                      {
                          "firstName": "CBB",
                          "patronymic": "CBB",
                          "surname": "CBB"
                      }
                  ]
              },
              "_id": "63e3e28f3bf7fbab6532f051",
              "id": "63e3e28f3bf7fbab6532f051"
          },
          "users": [
              {
                  "data": {
                      "surname": "C",
                      "mail": "c@gmail.com"
                  },
                  "_id": "63e37f79609334e79cd043d9",
                  "role": "salesman",
                  "id": "63e37f79609334e79cd043d9"
              },
              {
                  "data": {
                      "surname": "D",
                      "mail": "d@gmail.com"
                  },
                  "_id": "63e37fa2609334e79cd043dc",
                  "role": "salesman",
                  "id": "63e37fa2609334e79cd043dc"
              }
          ]
        }
      ]
    ```
 
* **Error Response:**

    None

* **Notes:**

    None

</details>
 
 **Add todo**
----
Creates a new todo.\
Создает новую задачу.

<details>

* **URL**

    /todos

* **Method:**

    `POST`

* **Headers:**

    `'Authorization': 'Bearer [access-token]'`

    Is inserted into requests automatically by an axios interceptor.\
    Вставляется в запросы автоматически.

    `'Content-Type': 'application/json'`

*  **URL Params**

    None

* **Query Params**

    None

* **Data Params**

    ```json
      {
        "company": "63e3e28f3bf7fbab6532f051",
        "isDone": false,
        "data": {
          "type": "meet",
          "startTime": "2023-02-11T10:00",
          "endTime": "2023-02-11T012:30",
          "title": "заголовок таска",
          "text": "тело таска"
        }
      }
    ```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
        "newTodo": {
            "data": {
                "type": "meet",
                "startTime": "2023-02-11T10:00",
                "endTime": "2023-02-11T012:30",
                "title": "заголовок таска",
                "text": "тело таска"
            },
            "isDone": false,
            "extra": {
                "year": "2023",
                "month": "02",
                "day": "11"
            },
            "company": "63e3e28f3bf7fbab6532f051",
            "users": [
                "63e37f79609334e79cd043d9",
                "63e37fa2609334e79cd043dc"
            ],
            "_id": "63e79f3cf883361ef9d4e5ef",
            "__v": 0
        }
      }
    ```
 
* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />

    * **Code:** 401 UNAUTHORIZED <br />

    * **Code:** 403 FORBIDDEN <br />

* **Notes:**

    All fields except 'text' are required.\
    Все поля кроме 'text' обязательны.
</details>

**Update todo**
----
Updates attributes of specified todo.\
Обновляет данные указанной задачи.

<details>

* **URL**

    /todos/:id

* **Method:**

    `PATCH`

* **Headers:**

    `'Authorization': 'Bearer [access-token]'`

    Is inserted into requests automatically by an axios interceptor.\
    Вставляется в запросы автоматически.

    `'Content-Type': 'application/json'`

*  **URL Params**

    **Required:**

    `id=[string]`

* **Query Params**

    None

* **Data Params**

    ```json
      {
        "isDone": true
      }
    ```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
        "updatedData": {
            "isDone": true
        }
      }
    ```
 
* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />

    * **Code:** 401 UNAUTHORIZED <br />

    * **Code:** 403 FORBIDDEN <br />

    * **Code:** 404 NOT FOUND <br />

* **Notes:**

    None

</details>
