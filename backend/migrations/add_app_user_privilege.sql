CREATE TABLE app_user_privilege (
    app_user INTEGER references app_user(id),
    privilege TEXT,
    PRIMARY KEY (app_user, privilege)
)