Деплой: https://rsclone-backend-production.up.railway.app

Для отправки запросов на сервер вначале нужно авторизоваться (см. Log In). Затем из ответа сервера скопировать accessToken и добавить к своим запросам хедер вида 'Authorization': 'Bearer [accessToken]'. Токен действует 15 минут. По истечении этого времени нужно обновить авторизацию (см. Refresh) или авторизоваться снова, и вставить в соответствующий хедер новый accessToken.

**Log In**
----
Logs a user in.\
Авторизует пользователя.

<details>

* **URL**

    /auth/login

* **Method:**

    `POST`

* **Headers:**

    `'Content-Type': 'application/json'`

*  **URL Params**

    None

* **Query Params**

    None

* **Data Params**\
    Руководитель:

    ```json
      {
        "mail": "b@gmail.com",
        "password": "123321123"
      }
    ```
    
    Продавец:
    
    ```json
      {
        "mail": "d@gmail.com",
        "password": "123321123"
      }
    ```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYWlsIjoiYkBnbWFpbC5jb20iLCJfaWQiOiI2M2UzN2YyNTc4ZTk3NmY3ZWVjNjMyZWEiLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTY3NzU4MjM0OCwiZXhwIjoxNjc3NTgzMjQ4fQ.X2eyld4n-ia5p-YsqTExPHpM62UwFK90SYFmPeYr770",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYWlsIjoiYkBnbWFpbC5jb20iLCJfaWQiOiI2M2UzN2YyNTc4ZTk3NmY3ZWVjNjMyZWEiLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTY3NzU4MjM0OCwiZXhwIjoxNjc4ODc4MzQ4fQ.i_HXvg98e4hFqFPs80OdBwrxoBozXbdzC4I6txN2vBg",
    "user": {
        "mail": "b@gmail.com",
        "_id": "63e37f2578e976f7eec632ea",
        "role": "manager"
    }
      }
    ```
 
* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />

    * **Code:** 404 NOT FOUND <br />

* **Notes:**

   None
   
</details>

**Refresh**
----
Returns new tokens.\
Возвращает новые токены.

<details>

* **URL**

    /auth/refresh

* **Method:**

    `GET`

* **Headers:**
    
    None

*  **URL Params**

    None

* **Query Params**

    None

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYWlsIjoiYkBnbWFpbC5jb20iLCJfaWQiOiI2M2UzN2YyNTc4ZTk3NmY3ZWVjNjMyZWEiLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTY3NzU4MjM0OCwiZXhwIjoxNjc3NTgzMjQ4fQ.X2eyld4n-ia5p-YsqTExPHpM62UwFK90SYFmPeYr770",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYWlsIjoiYkBnbWFpbC5jb20iLCJfaWQiOiI2M2UzN2YyNTc4ZTk3NmY3ZWVjNjMyZWEiLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTY3NzU4MjM0OCwiZXhwIjoxNjc4ODc4MzQ4fQ.i_HXvg98e4hFqFPs80OdBwrxoBozXbdzC4I6txN2vBg",
    "user": {
        "mail": "b@gmail.com",
        "_id": "63e37f2578e976f7eec632ea",
        "role": "manager"
    }
      }
    ```
 
* **Error Response:**

    * **Code:** 401 UNAUTHORIZED <br />

* **Notes:**

    To successfully receive new tokens make sure that cookies have refreshToken in them. The refresh token is added to cookies automatically at log in.\
    Для того, чтобы запрос успешно отработал, в куках должен быть записан refreshToken. Он записывается туда автоматически при авторизации.

</details>

**Log Out**
----
Logs a user out.\
Совершает логаут пользователя.

<details>

* **URL**

    /auth/logout

* **Method:**

    `POST`

* **Headers:**

    `'Content-Type': 'application/json'`

*  **URL Params**

    None

* **Query Params**

    None

* **Data Params**
    
    None

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
        "logout": true
      }
    ```
 
* **Error Response:**

    None

* **Notes:**

   None
   
</details>

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
            "firstName": "Brian",
            "patronymic": "",
            "surname": "Smith",
            "birthday": "1989-12-08",
            "mail": "b@gmail.com",
            "phone": "+77743212121"
          },
          "_id": "63e37f2578e976f7eec632ea",
          "role": "manager",
          "companies": [
            {
                "data": {
                    "companyName": "Cyber Company"
                },
                "_id": "63e3e28f3bf7fbab6532f051",
                "users": [
                    "63e37f79609334e79cd043d9",
                    "63e37fa2609334e79cd043dc",
                    "63e37f2578e976f7eec632ea"
                ],
                "id": "63e3e28f3bf7fbab6532f051"
            },
            ...
          ],
          "todos": [
            {
                "data": {
                    "type": "common",
                    "startTime": "2023-02-09T08:00",
                    "endTime": "2023-02-09T09:30",
                    "title": "заголовок таска",
                    "text": "тело таска"
                },
                "extra": {
                    "year": "2023",
                    "month": "02",
                    "day": "09"
                },
                "_id": "63e3edd4079d257910bc50ca",
                "isDone": true,
                "company": "63e3e28f3bf7fbab6532f051",
                "users": [
                    "63e37f79609334e79cd043d9",
                    "63e37fa2609334e79cd043dc",
                    "63e37f2578e976f7eec632ea"
                ]
            },
            ...
          ],
          "id": "63e37f2578e976f7eec632ea"
        },
        ...
      ]
    ```
 
* **Error Response:**

    * **Code:** 401 UNAUTHORIZED <br />

    * **Code:** 403 FORBIDDEN <br />

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

    `'Content-Type': 'application/json'`

*  **URL Params**

    None

* **Query Params**

    None

* **Data Params**

    ```json
      {
        "data": {
            "firstName": "Инесса",
            "patronymic": "Михайловна",
            "surname": "Рябчик",
            "birthday": "1975-10-07",
            "mail": "inessa@gmail.com",
            "phone": "+77742548",
            "password": "123321123"
        },
        "role": "salesman",
        "settings" : {
          "language": "en"
        }
      }
    ```

* **Success Response:**

  * **Code:** 201 CREATED <br />
    **Content:** 
    ```json
      {
        "newUser": {
            "data": {
                "firstName": "Инесса",
                "patronymic": "Михайловна",
                "surname": "Рябчик",
                "birthday": "1975-10-07",
                "mail": "inessa@gmail.com",
                "phone": "+77742548",
                "password": "123321123"
            },
            "role": "salesman",
            "settings": {
                "language": "en"
            }
        }
      }
    ```
 
* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />

    * **Code:** 401 UNAUTHORIZED <br />

    * **Code:** 403 FORBIDDEN <br />

* **Notes:**

    Only manager and admin can create new users. All fields except 'settings' are required. Accepted roles: 'manager', 'salesman'. Mail should be unique and a correct email. Password should be at least 8 symbols long. Role must be either 'manager' or 'salesman'.\
    Только менеджер и админ имеют право создавать новых пользователей. Все поля кроме 'patronymic' и 'settings' обязательны. Поле mail должно быть уникальным и в правильном формате. Пароль должнен быть длиной не менее 8 символов. В качестве роли можно указать только 'manager' или 'salesman'.
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
                "companyName": "Мотиватор",
                "inn": 1232102311,
                "address": "asdasd"
            },
            "contacts": {
                "commonPhone": [
                    "+78124267070"
                ],
                "commonMail": "office@motivator.ru",
                "workers": []
            },
            "_id": "63fc910fdd900e640ce6e8fb",
            "users": [
                {
                    "data": {
                        "surname": "D",
                        "mail": "d@gmail.com"
                    },
                    "_id": "63e37fa2609334e79cd043dc",
                    "role": "salesman",
                    "id": "63e37fa2609334e79cd043dc"
                }
            ],
            "__v": 0,
            "todos": [],
            "id": "63fc910fdd900e640ce6e8fb"
        },
        ...
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
Создает новую компанию.

<details>

* **URL**

    /companies

* **Method:**

    `POST`

* **Headers:**

    `'Authorization': 'Bearer [access-token]'`

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

  * **Code:** 201 CREATED <br />
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

    Company name and phone are required. Mail should be unique and a correct email.\
    Название и телефон компании обязательны. Поле mail должно быть уникальным и в правильном формате.
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
    
    `user=[id]`

    By default salesman receives only his/her own tasks, while manager and admin receive all users' tasks. If `user=[id]` parameter is passed, api will return tasks of the specified user.\
    По умолчанию продавец получает только свои задачи, а менеджер и админ получают задачи всех пользователей. Если передан параметр `user=[id]`, апи вернет json с задачами указанного пользователя.

    If query params are not passed, api will return all tasks.\
    Если query-параметры не указаны, вернется список задач за все время.

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    
    Without query params:
    
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
        },
        ...
      ]
    ```
    '?range=month'
    ```json
      [
        {
          "complete": 0,
          "future": 0,
          "missed": 0
        },
        ...
      ]
    ```
    '?range=day'
    ```json
      [
        "todos": [
          ...
        ],
        "todosPlacement": [
          {
            "_id": "63e82f3bdcda56cdb4cd0607",
            "start": 1676174400000,
            "end": 1676179800000,
            "column": 1
          },
          ...
        ],
        "columnsNumber": 4
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

  * **Code:** 201 CREATED <br />
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

**Get Contacts**
----
Returns json data about contacts.\
Возвращает json с данными о контактах.

<details>

* **URL**

    /contacts

* **Method:**

    `GET`

* **Headers:**
    
    `'Authorization': 'Bearer [access-token]'`

*  **URL Params**

    None

* **Query Params**

    **Optional:**

    None

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      [
        {
          "firstName": "CBBbb",
          "patronymic": "CBB",
          "surname": "CBB",
          "birthday": "1990-02-28",
          "mail": "cbb@gmail.com",
          "phone": [
              "+777"
          ],
          "_id": "63e7e5c3d46c32fcbf7891fa",
          "companyName": "CB",
          "companyId": "63e3e28f3bf7fbab6532f051",
          "users": [
              {
                  "data": {
                      "surname": "C",
                      "mail": "c@gmail.com"
                  },
                  "_id": "63e37f79609334e79cd043d9",
                  "id": "63e37f79609334e79cd043d9"
              },
              {
                  "data": {
                      "surname": "D",
                      "mail": "d@gmail.com"
                  },
                  "_id": "63e37fa2609334e79cd043dc",
                  "id": "63e37fa2609334e79cd043dc"
              }
          ]
        }
      ]
    ```
 
* **Error Response:**

    * **Code:** 401 UNAUTHORIZED <br />

* **Notes:**

    None

</details>

**Add contact**
----
Creates a new contact.\
Создает новый контакт.

<details>

* **URL**

    /contacts

* **Method:**

    `POST`

* **Headers:**

    `'Authorization': 'Bearer [access-token]'`

    `'Content-Type': 'application/json'`

*  **URL Params**

    None

* **Query Params**

    None

* **Data Params**

    ```json
      {
        "contact": {
            "firstName": "CFAa",
            "patronymic": "CFAa",
            "surname": "CFAa",
            "birthday": "1989-04-08",
            "mail": "cfaa@gmail.com",
            "phone": [
                "+777"
            ]
        },
        "companyId": "63e3e28f3bf7fbab6532f051"
      }
    ```

* **Success Response:**

  * **Code:** 201 CREATED <br />
    **Content:** 
    ```json
      {
        "newClient": {
          "firstName": "CFAa",
          "patronymic": "CFAa",
          "surname": "CFAa",
          "birthday": "1989-04-08",
          "mail": "cfaa@gmail.com",
          "phone": [
              "+777"
          ]
        }
      }
    ```
 
* **Error Response:**

    * **Code:** 400 BAD REQUEST <br />

    * **Code:** 401 UNAUTHORIZED <br />

    * **Code:** 403 FORBIDDEN <br />

* **Notes:**

    
</details>

**Update contact**
----
Updates attributes of a specified contact.\
Обновляет данные указанного контакта.

<details>

* **URL**

    /contacts/:id

* **Method:**

    `PATCH`

* **Headers:**

    `'Authorization': 'Bearer [access-token]'`

    `'Content-Type': 'application/json'`

*  **URL Params**

    **Required:**

    `id=[string]`

* **Query Params**

    None

* **Data Params**

    ```json
      {
        "mail": "cfaaa@gmail.com"
      }
    ```

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content:** 
    ```json
      {
        "updatedWorker": {
            "firstName": "CFAa",
            "patronymic": "CFAa",
            "surname": "CFAa",
            "birthday": "1989-04-08",
            "mail": "cfaaa@gmail.com",
            "phone": [
                "+777"
            ],
            "_id": "63e81bbce2d6e2ef8dab3d88"
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

**Delete contact**
----
Delete specified contact.\
Удаляет указанный контакт.

<details>

* **URL**

    /contacts/:id

* **Method:**

    `DELETE`

* **Headers:**

    `'Authorization': 'Bearer [access-token]'`

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
        "deletedWorker": [
            {
                "firstName": "CFAa",
                "patronymic": "CFAa",
                "surname": "CFAa",
                "birthday": "1989-04-08",
                "mail": "cfaaa@gmail.com",
                "phone": [
                    "+777"
                ],
                "_id": "63e81bbce2d6e2ef8dab3d88"
            }
        ]
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
