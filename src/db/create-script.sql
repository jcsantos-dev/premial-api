create table reward_type
(
    id          bigserial
        primary key,
    name        varchar(255) not null,
    description varchar(255) not null
);

alter table reward_type
    owner to postgres;

create table program_type
(
    id          bigserial
        primary key,
    name        varchar(255) not null,
    description varchar(255) not null
);

alter table program_type
    owner to postgres;

create table coupon_type
(
    id          bigserial
        primary key,
    name        varchar(255) not null,
    description varchar(255) not null
);

alter table coupon_type
    owner to postgres;

create table store
(
    id          bigserial
        primary key,
    name        varchar(255) not null,
    description varchar(255) not null,
    uuid        uuid         not null
);

alter table store
    owner to postgres;

create table coupon
(
    uuid              uuid                 not null
        primary key,
    title             varchar(255)         not null,
    description       varchar(255)         not null,
    reward_type_id    bigint               not null
        constraint coupon_reward_type_id_foreign
            references reward_type,
    program_type_id   bigint               not null
        constraint coupon_program_type_id_foreign
            references program_type,
    coupon_type_id    bigint               not null
        constraint coupon_coupon_type_id_foreign
            references coupon_type,
    store_id          bigint               not null
        constraint coupon_store_id_foreign
            references store,
    required_quantity bigint               not null,
    required_amount   numeric(8, 2)        not null,
    valid_from        timestamp,
    valid_to          timestamp,
    is_active         boolean default true not null
);

alter table coupon
    owner to postgres;

create index coupon_store_id_index
    on coupon (store_id);

create index idx_coupon_reward_type
    on coupon (reward_type_id);

create index idx_coupon_program_type
    on coupon (program_type_id);

create index idx_coupon_coupon_type
    on coupon (coupon_type_id);

create table program
(
    id              bigserial
        primary key,
    store_id        bigint                not null
        constraint program_store_id_foreign
            references store,
    program_type_id bigint                not null
        constraint program_program_type_id_foreign
            references program_type,
    is_activated    boolean default false not null
);

alter table program
    owner to postgres;

create index program_store_id_index
    on program (store_id);

create table "user"
(
    id         bigserial
        primary key,
    email      varchar(255) not null,
    first_name varchar(255) not null,
    last_name  varchar(255) not null,
    created_at timestamp(0) not null,
    uuid       uuid         not null
);

alter table "user"
    owner to postgres;

create table auth_type
(
    id          bigserial
        primary key,
    name        varchar(255) not null,
    description varchar(255) not null
);

alter table auth_type
    owner to postgres;

create table user_auth
(
    id                    bigserial
        primary key,
    user_id               bigint       not null
        constraint user_auth_user_id_foreign
            references "user",
    auth_type_id          bigint       not null
        constraint user_auth_auth_type_id_foreign
            references auth_type,
    auth_user_provider_id varchar(255) not null,
    email                 varchar(255) not null,
    password_hash         varchar(255),
    created_at            timestamp(0) not null
);

alter table user_auth
    owner to postgres;

create index user_auth_user_id_index
    on user_auth (user_id);

create index idx_user_auth_email
    on user_auth (email);

create table user_customer
(
    id        bigserial
        primary key,
    user_id   bigint       not null
        constraint user_customer_user_id_foreign
            references "user",
    phone     varchar(255) not null,
    birthdate date         not null
);

alter table user_customer
    owner to postgres;

create table user_role
(
    id          bigserial
        primary key,
    name        varchar(255) not null,
    description varchar(255) not null
);

alter table user_role
    owner to postgres;

create table user_store
(
    id       bigserial
        primary key,
    user_id  bigint not null
        constraint user_store_user_id_foreign
            references "user",
    store_id bigint not null,
    role_id  bigint not null
        constraint user_store_role_id_foreign
            references user_role
);

alter table user_store
    owner to postgres;

create index user_store_user_id_index
    on user_store (user_id);

create index user_store_store_id_index
    on user_store (store_id);

create table user_platform
(
    id      bigserial
        primary key,
    user_id bigint not null
        constraint user_platform_user_id_foreign
            references "user",
    role_id bigint not null
        constraint user_platform_role_id_foreign
            references user_role
);

alter table user_platform
    owner to postgres;

create index user_platform_user_id_index
    on user_platform (user_id);

create index user_platform_role_id_index
    on user_platform (role_id);

create table frequency_type
(
    id          bigserial
        primary key,
    name        varchar(50)  not null,
    description varchar(255) not null
);

alter table frequency_type
    owner to postgres;

create table streak_type
(
    id          bigserial
        primary key,
    name        varchar(50)  not null,
    description varchar(255) not null
);

alter table streak_type
    owner to postgres;

create table level_type
(
    id          bigserial
        primary key,
    name        varchar(50)  not null,
    description varchar(255) not null
);

alter table level_type
    owner to postgres;

create table streak_conf
(
    id                bigserial
        primary key,
    store_id          bigint
        constraint fk_streak_conf_store
            references store
            on delete set null,
    streak_type_id    bigint                  not null
        constraint fk_streak_conf_streak_type
            references streak_type
            on delete restrict,
    frequency_type_id bigint                  not null
        constraint fk_streak_conf_frequency_type
            references frequency_type
            on delete restrict,
    frequency_value   integer                 not null
        constraint streak_conf_frequency_value_check
            check (frequency_value > 0),
    is_active         boolean   default true  not null,
    created_at        timestamp default now() not null,
    updated_at        timestamp default now() not null
);

alter table streak_conf
    owner to postgres;

create index idx_streak_conf_store_id
    on streak_conf (store_id);

create index idx_streak_conf_type_id
    on streak_conf (streak_type_id);

create table level_conf
(
    id                bigserial
        primary key,
    level_type_id     bigint                  not null
        constraint fk_level_conf_level_type
            references level_type
            on delete restrict,
    store_id          bigint
        constraint fk_level_conf_store
            references store
            on delete set null,
    name              varchar(50)             not null,
    description       varchar(255)            not null,
    min_points        integer                 not null
        constraint level_conf_min_points_check
            check (min_points >= 0),
    max_points        integer                 not null,
    frequency_type_id bigint                  not null
        constraint fk_level_conf_frequency_type
            references frequency_type
            on delete restrict,
    is_active         boolean   default true  not null,
    created_at        timestamp default now() not null,
    updated_at        timestamp default now() not null,
    constraint uq_levelconf_store_levelname
        unique (store_id, level_type_id, name),
    constraint level_conf_check
        check (max_points >= min_points)
);

alter table level_conf
    owner to postgres;

create index idx_level_conf_store_id
    on level_conf (store_id);

create index idx_level_conf_level_type_id
    on level_conf (level_type_id);

create table user_loyalty
(
    id              bigserial
        primary key,
    user_id         bigint                  not null
        constraint fk_user_loyalty_user
            references "user",
    store_id        bigint
        constraint fk_user_loyalty_store
            references store,
    points          integer   default 0     not null,
    visits          integer   default 0     not null,
    referrals       integer   default 0     not null,
    redeemed_points integer   default 0     not null,
    created_at      timestamp default now() not null,
    updated_at      timestamp default now() not null,
    constraint uq_user_loyalty
        unique (user_id, store_id)
);

alter table user_loyalty
    owner to postgres;

create table loyalty_action_type
(
    id          bigserial
        primary key,
    name        varchar(50)  not null,
    description varchar(255) not null
);

alter table loyalty_action_type
    owner to postgres;

create table user_loyalty_log
(
    id                     bigserial
        primary key,
    user_id                bigint                  not null
        constraint fk_user_loyalty_log_user
            references "user",
    store_id               bigint
        constraint fk_user_loyalty_log_store
            references store,
    loyalty_action_type_id bigint                  not null
        constraint fk_user_loyalty_log_action
            references loyalty_action_type,
    points_delta           integer   default 0,
    visits_delta           integer   default 0,
    referral_user_id       bigint
        constraint fk_user_loyalty_log_referral
            references "user",
    coupon_id              uuid
        constraint fk_user_loyalty_log_coupon
            references coupon,
    program_id             bigint
        constraint fk_user_loyalty_log_program
            references program,
    note                   text,
    created_at             timestamp default now() not null
);

alter table user_loyalty_log
    owner to postgres;

create index idx_user_loyalty_log_user
    on user_loyalty_log (user_id);

create index idx_user_loyalty_log_store
    on user_loyalty_log (store_id);

create index idx_user_loyalty_log_action
    on user_loyalty_log (loyalty_action_type_id);

create table user_streak
(
    id              bigserial
        primary key,
    user_id         bigint                  not null
        constraint fk_user_streak_user
            references "user",
    store_id        bigint
        constraint fk_user_streak_store
            references store,
    streak_conf_id  bigint                  not null
        constraint fk_user_streak_conf
            references streak_conf,
    current_streak  integer   default 0     not null,
    longest_streak  integer   default 0     not null,
    last_check_date date                    not null,
    created_at      timestamp default now() not null,
    updated_at      timestamp default now() not null,
    constraint uq_user_streak
        unique (user_id, store_id, streak_conf_id)
);

alter table user_streak
    owner to postgres;

create index idx_user_streak_user
    on user_streak (user_id);

create table user_level
(
    id             bigserial
        primary key,
    user_id        bigint                  not null
        constraint fk_user_level_user
            references "user",
    store_id       bigint
        constraint fk_user_level_store
            references store,
    level_conf_id  bigint                  not null
        constraint fk_user_level_conf
            references level_conf,
    current_points integer   default 0     not null,
    achieved_at    timestamp default now() not null,
    created_at     timestamp default now() not null,
    updated_at     timestamp default now() not null,
    constraint uq_user_level
        unique (user_id, store_id, level_conf_id)
);

alter table user_level
    owner to postgres;

create index idx_user_level_user
    on user_level (user_id);


