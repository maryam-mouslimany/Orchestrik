<img src="./readme/title1.svg"/>

<br>

<!-- project overview -->
<img src="./readme/title2.svg"/>

> Orchestrik is a company-ready task management platform for teams that don’t have room for mess. It blends AI assignment, automation, and clear data visualizations to keep work moving, lock in ownership, and hit deadlines. From kickoff to delivery, tasks route to the right people, updates are automatic, and progress is visible.

<br>

<!-- System Design -->
<img src="./readme/title3.svg"/>

### ER Diagram
<img src="./readme/system_design/er_diagram.png"/>

### Component Diagram
<img src="./readme/system_design/system_architecture.png"/>

<br>
<!-- Project Highlights -->
<img src="./readme/title4.svg"/>

### Project Highlights

- **AI Agent Auto-Assign:** Takes the task title and description, extracts the required skills, matches them to members’ skill profiles, and if multiple qualify compares current workload (e.g., open tasks) to assign the least-loaded qualified member.

- **n8n Automation (Slack Channel Creation):** On project creation, an n8n workflow creates a Slack channel, invites the team members, and posts a kickoff message so collaboration starts instantly.

- **Clear Charts & Data Visualization:** Dashboards show status breakdowns, per-assignee and per-project views, and trends over time (throughput, cycle time, reopens, overdues), with filters and tooltips for quick drill-downs.

- **Live Notifications:** Real-time notifications let users know when they’re assigned, mentioned, or when task status changes, updating badges and lists instantly without refresh.

<br>

<!-- Demo -->
<img src="./readme/title5.svg"/>

### Admin Screens

| Dashboard                              | Dashboard                        |                         |
| -------------------------------------- | -------------------------------- | ----------------------- |
| ![Landing](./readme/demo/dashboard1.png) | ![fsdaf](./readme/demo/dashboard2.png) |

| Create Project                           | Users Management                   |                         |
| ---------------------------------------- | ---------------------------------- | ----------------------- |
| ![Landing](./readme/demo/create_project.png) | ![fsdaf](./readme/demo/users.png)  |

### Project Manager Screens

| Projects Managed by this PM             | Project Analytics                  |
| -------------------------------------- | ---------------------------------- |
| ![Landing](./readme/demo/pm_projects.png) | ![fsdaf](./readme/demo/pm_analytics.png) |

| View Tasks                              | Create Task                        |                         |
| --------------------------------------- | ---------------------------------- | ----------------------- |
| ![Landing](./readme/demo/pm_tasks.png)  | ![fsdaf](./readme/demo/pm_create_task.png) |

### Employee Screens

| Assigned Tasks                           | Mark Task progress                 |
| ---------------------------------------- | ---------------------------------- |
| ![Landing](./readme/demo/employee_tasks.png) | ![fsdaf](./readme/demo/employee_edit_task.png) |

### Sexy Features

| Ai Agent Auto Assign                     | Data Visualization                 |
| ---------------------------------------- | ---------------------------------- |
| ![Landing](./readme/demo/create_task.gif) | ![fsdaf](./readme/demo/dashboard.gif) |

n8n Automation: Slack Channel Creation  
![fsdaf](./readme/demo/create_project.gif)

<br>

<!-- Development & Testing -->
<img src="./readme/title6.svg"/>

### Services, Validation and Testing

| Services                                 | Validation                         | Testing                           |
| ---------------------------------------- | ---------------------------------- | --------------------------------- |
| ![Landing](./readme/testing/service.png) | ![fsdaf](./readme/testing/validation.png) | ![fsdaf](./readme/testing/tests.png) |

### Ci Workflow

|                                          |                                    |
| ---------------------------------------- | ---------------------------------- |
| ![Landing](./readme/testing/ci1.png)     | ![fsdaf](./readme/testing/ci2.png) |

### Linear
I chose Linear to manage tasks and sprints because it keeps development work connected to issues. Each feature or bug fix starts with a Linear ticket, which links directly to branches, commits, and pull requests, making the workflow easier to follow.

|                                          |                                    |
| ---------------------------------------- | ---------------------------------- |
| ![Landing](./readme/testing/linear1.png) | ![fsdaf](./readme/testing/linear2.png) |

#### Linear Workflow (high level)
Create a ticket in Linear →  
Create a Git branch (following Linear’s naming conventions) →  
Commit changes (include the corresponding task ID in the commit message) →  
Push the branch to the remote repository →  
Open a pull request and request a review →  
Merge the pull request once it has been reviewed and approved.

### API Docs & Testing (Swagger & Postman)

**Swagger:** Live API documentation with schemas and a “Try it out” panel to execute requests against your local server.  
**Postman:** Versioned collections and environments for manual testing and quick regression checks.

#### Swagger

|  |  |
| --- | --- |
| ![](./readme/testing/swagger1.png) | ![](./readme/testing/swagger2.png) |

#### Postman

### Postman

| Environement | Postman Request & Response | Postman Request & Response |
| --- | --- | --- |
| ![](./readme/testing/environment.png) | ![](./readme/testing/postman2.png) | ![](./readme/testing/postman3.png) |


<br>

<!-- Deployment -->
<img src="./readme/title7.svg"/>

### Deployment (Workflow)

- Create a feature branch locally.
- Push the branch to origin and open a pull request.
- Merge the pull request into dev.
- CI on dev runs tests, builds Docker images for the services, and pushes them to the registry.
- Deploy to staging: pull images, start the stack with docker compose, then run database migrations.
- QA on staging.
- Merge dev into main.
- CI/CD for production: rebuild and push images, deploy with the same compose file, and run migrations.
- Roll back by redeploying a previous image tag and restoring a recent database backup if needed.


<br>
