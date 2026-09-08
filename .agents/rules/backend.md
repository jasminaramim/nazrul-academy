---
description: Rules for backend clean architecture
---

# Backend Architecture Rules

When working on the backend of this project, you must follow these rules:

1.  **Folder Structure**: All backend code must reside in the `backend/` directory at the project root.
2.  **Clean Architecture**: The code must be organized into the following layers:
    *   `model`: For data definitions, schemas, and direct database interaction functions.
    *   `middleware`: For Express middlewares (e.g., authentication, validation).
    *   `controller`: For handling request/response logic and orchestrating models.
    *   `routes`: For defining API endpoints and mapping them to controllers.
    *   `config` / `utils`: For configuration (like MongoDB connection) and helper functions.
3.  **File Size Limit**: Every file in the backend must not exceed **150 lines of code**. If a file grows larger, you must refactor and split it into smaller, more focused modules.
4.  **Separation of Concerns**: Controllers should not contain complex business logic or direct database queries if possible; they should rely on models/services. Routes should only define endpoints and link to controllers.

Follow these rules strictly during any modifications or refactoring of the server code.
