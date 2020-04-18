CREATE TABLE tasks (
     id SERIAL PRIMARY KEY,
     projectid INTEGER REFERENCES projects(id) ON DELETE CASCADE,
     task_name TEXT NOT NULL,
     assignedTo INTEGER REFERENCES users(id) ON DELETE SET NULL,
     description TEXT,
     priority priority_type NOT NULL,
     status status_type NOT NULL,
     datecreated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
     datemodified TIMESTAMP,
     dateclosed TIMESTAMP WITH TIME ZONE
);