# Клиент-серверное приложение для управления биллбордами

## Описание проекта

Данный проект представляет собой разработку клиент-серверного приложения, реализующего функциональные требования (CRUD-операции) в рамках указанной предметной области. Приложение служит разделом личного кабинета менеджера компании-владельца биллбордов, отвечающего за распределение заявок на размещение рекламы.

## Технические требования

### Клиентская сторона
- **Технологии**: HTML, CSS, JavaScript
- **Фреймворки/Библиотеки**: Разрешено использовать любую библиотеку или фреймворк для построения пользовательского веб-интерфейса.

### Серверная сторона
- **Технологии**: JavaScript, Node.js
- **Фреймворки/Библиотеки**: Разрешено использовать любую библиотеку или фреймворк для создания сервера.

### API
- **Взаимодействие**: Клиент и сервер взаимодействуют через спроектированный REST-like API.

### База данных
- **Хранение данных**: Данные на серверной стороне хранятся в базе данных. Разрешено использовать любую БД и СУБД, к которой возможно подключиться из JavaScript-кода.
- **Альтернатива**: Вместо JavaScript разрешено использовать TypeScript.

## Функциональные возможности приложения

### Управление биллбордами
- **Список биллбордов**: Отображает список биллбордов с возможностью добавления, удаления и редактирования информации о них.
- **Информация о биллборде**:
  - Адрес расположения (строка)
  - ID (строка, нередактируемый атрибут)

### Управление заявками на размещение рекламы
- **Список заявок**: Для каждого биллборда указывается список заявок на размещение рекламы.
- **Операции с заявками**:
  - Добавление заявок
  - Удаление заявок
  - Перевод заявок с одного биллборда на другой

### Параметры заявки
- **Наименование компании-рекламодателя**: (строка)
- **ID заявки**: (строка, нередактируемый атрибут)
- **Даты аренды**: Даты начала и окончания аренды (объекты дат)
- **Период аренды**: Итоговый период аренды должен быть больше или равен `MIN` и меньше или равен `MAX` (где `MIN` и `MAX` - целые неотрицательные числа, задаваемые разработчиком).

### Валидация
- **Проверка пересечения дат**: При добавлении или изменении параметров заявки необходимо проверить, нет ли пересечения по датам с уже имеющимися заявками.
- **Проверка продолжительности аренды**: Убедиться, что продолжительность аренды укладывается в диапазон `[MIN; MAX]`.
- **Уведомления**: Если условия не выполняются, должно отображаться уведомление-предупреждение о невозможности выполнения данной операции.
