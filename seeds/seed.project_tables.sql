BEGIN;

INSERT INTO company (company_name)
VALUES
('Demo'),
('Thinkful')
;

INSERT INTO users (email, full_name, password, isadmin, companyid)
VALUES
('lindseyzylstra@yahoo.com', 'Lindsey Zylstra', '$2a$12$d1t6lPTxudxoqWG2dCfZ4u9R0lXUE4RFC2dzqHi5mUM/DC7D8VIqm', 'false', 1),
('demo@demo.com', 'Demo User', '$2a$12$d1t6lPTxudxoqWG2dCfZ4u9R0lXUE4RFC2dzqHi5mUM/DC7D8VIqm', 'false', 1),
('demo-admin@demo.com', 'Demo Admin', '$2a$12$d1t6lPTxudxoqWG2dCfZ4u9R0lXUE4RFC2dzqHi5mUM/DC7D8VIqm', 'true', 1)
;

INSERT INTO projects (project_name, description, dateadded, duedate, dateclosed, priority, status, companyid)
VALUES
('Implement space management software', 'Smacebook has had this new software for months but has not been able to get it off of the ground.  We are partnering with them to get it set up and launched by the end of this month', '2020-04-03T13:30:00','2020-04-30T00:00:00', null, 'High', 'In Progress', 1),
('New Floor', 'Client would like us to clean the drawing for a new floor they will be adding to their New York portfolio.  Once thats done they would like it added to their Space Tracker software', '2020-04-02T04:30:00', '2020-04-17T04:30:00', null, 'High', 'In Progress', 1),
('Vacancy Report', 'We need to create a report that shows a map of clients locations.  It should include occupancy information as well as cost per seat.  They would also like to see a calendar of upcoming lease renewal dates with some notification for expiration dates that are within the next 3 months.', '2020-04-03T11:30:00','2020-06-03T14:30:00', null, 'Low', 'In Progress', 1),
('Obscure Client Request', 'Given only the absolute minimum of information, read the clients mind and create an adorable report for them.', '2020-04-03T14:45:00','2020-04-22T16:45:00', null, 'Medium', 'In Progress', 1),
('Emergency Data Pull', 'The CEO of Abstract-Clothes-Store needs occupancy data as soon as possible.  He would like to de-densify his workspaces to account for COVID-19 safety measures', '2020-04-03T14:45:00', '2020-04-03T15:30:00', null,  'Urgent', 'In Progress', 1),
('Closed Project', 'This is an example of a closed project.', '2020-03-31T14:30:00', '2020-04-01T14:30:00', '2020-04-01T14:00:00', 'Medium', 'Closed', 1 )
;

INSERT INTO tasks (projectid, task_name, assignedto, description, priority, status, datecreated, datemodified, dateclosed)
VALUES
(1, 'Set up employee sync', 1, 'We need to sync the software with Workday to get the clients data', 'High', 'New', '2020-04-03T14:30:00', null, null ),
(1, 'Documentation', 2, 'We need to document how to use the software for the client', 'High', 'In Progress', '2020-04-03T14:30:00', '2020-04-04T14:30:00', null ),
(2, 'Clean drawing', 3, 'Remove un-needed layers, clean up polylines', 'Medium', 'In Progress', '2020-04-03T14:30:00', '2020-04-04T14:30:00', null ),
(2, 'Add floor', 1, 'Add floor to clients space tracker', 'Low', 'New', '2020-04-03T14:30:00', null, null ),
(3, 'Get data', 2, 'Get data from client', 'Low', 'New', '2020-04-04T14:30:00', null, null ),
(4, 'Clarify', 2, 'Need more information to proceed', 'Low', 'On Hold', '2020-04-05T14:30:00', '2020-04-05T14:30:00', null ),
(5, 'Create report', 1, 'Pull data, run report, send to client', 'Urgent', 'In Progress', '2020-04-03T14:45:00', '2020-04-03T14:50:21', null ),
(6, 'Closed', 2, 'Closed task on a closed', 'Urgent', 'Closed', '2020-04-03T14:45:00', '2020-04-03T14:50:21', null )
;



COMMIT;