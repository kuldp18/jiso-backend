# Jiso Backend Data Dictionary

## Overview

This document provides detailed information about the data models used in the Jiso backend application. Each model is documented with its schema definition, field descriptions, relationships to other models, and usage context.

## Table of Contents

- [User Model](#user-model)
- [UserContext Model](#usercontext-model)
- [Journal Model](#journal-model)
- [Mood Model](#mood-model)
- [Chat Model](#chat-model)
- [Insight Model](#insight-model)

## User Model

Represents a user of the Jiso application with authentication and profile information.

### Schema Fields

| Field                           | Type          | Required | Description                                                            |
| ------------------------------- | ------------- | -------- | ---------------------------------------------------------------------- |
| firstName                       | String        | Yes      | User's first name                                                      |
| lastName                        | String        | Yes      | User's last name                                                       |
| email                           | String        | Yes      | User's email address (unique)                                          |
| password                        | String        | Yes      | Hashed password for authentication                                     |
| gender                          | String (enum) | Yes      | User's gender ('male', 'female', 'other')                              |
| age                             | Number        | Yes      | User's age                                                             |
| lastLogin                       | Date          | No       | Timestamp of the user's last login (defaults to account creation time) |
| isEmailVerified                 | Boolean       | No       | Indicates if the user's email has been verified (defaults to false)    |
| emailVerificationToken          | String        | No       | Token used to verify the user's email                                  |
| emailVerificationTokenExpiresAt | Date          | No       | Expiration timestamp for the email verification token                  |
| resetPasswordToken              | String        | No       | Token used for password reset                                          |
| resetPasswordTokenExpiresAt     | Date          | No       | Expiration timestamp for the password reset token                      |
| refreshToken                    | String        | No       | JWT refresh token for authentication (defaults to null)                |
| refreshTokenExpiresAt           | Date          | No       | Expiration timestamp for the refresh token (defaults to null)          |

### Virtual Fields

- **fullName**: Concatenation of firstName and lastName

### Relationships

- One-to-one with UserContext
- One-to-one with Insight
- One-to-many with Journal entries
- One-to-many with Mood entries
- One-to-many with Chat sessions

### Usage Context

The User model is central to the application's authentication system and stores essential profile information. It manages email verification, password reset functionality, and JWT-based authentication with refresh tokens.

## UserContext Model

Stores personalized context information about a user including their goals, struggles, and thematic patterns observed in their interactions with the app.

### Schema Fields

| Field                               | Type                   | Required | Description                                                    |
| ----------------------------------- | ---------------------- | -------- | -------------------------------------------------------------- |
| userId                              | ObjectId (ref: 'User') | Yes      | Reference to the user                                          |
| lastWeeklyUpdate                    | Date                   | No       | Last time weekly themes were updated                           |
| lastWeeklyUpdateStatus              | String (enum)          | No       | Status of last weekly update ('pending', 'complete', 'error')  |
| lastWeeklyUpdateError               | String                 | No       | Error message if weekly update failed                          |
| lastMonthlyUpdate                   | Date                   | No       | Last time monthly themes were updated                          |
| lastMonthlyUpdateStatus             | String (enum)          | No       | Status of last monthly update ('pending', 'complete', 'error') |
| lastMonthlyUpdateError              | String                 | No       | Error message if monthly update failed                         |
| goals                               | Array                  | No       | Collection of user's goals                                     |
| goals[].goal                        | String                 | Yes      | The goal description                                           |
| goals[].description                 | String                 | No       | Additional details about the goal                              |
| goals[].createdAt                   | Date                   | No       | When the goal was created                                      |
| goals[].completed                   | Boolean                | No       | Whether the goal has been completed                            |
| struggles                           | Array                  | No       | Collection of user's struggles                                 |
| struggles[].struggle                | String                 | Yes      | The struggle description                                       |
| struggles[].description             | String                 | No       | Additional details about the struggle                          |
| struggles[].severity                | Number                 | No       | Severity rating from 0-10 (-1 if not rated)                    |
| struggles[].createdAt               | Date                   | No       | When the struggle was identified                               |
| moodThemes                          | Object                 | No       | Themes identified from user's mood entries                     |
| moodThemes.weekly                   | Array                  | No       | Weekly mood themes                                             |
| moodThemes.weekly[].date            | Date                   | No       | When the theme was generated                                   |
| moodThemes.weekly[].theme           | String                 | Yes      | The identified theme                                           |
| moodThemes.weekly[].description     | String                 | No       | Description of the theme                                       |
| moodThemes.monthly                  | Array                  | No       | Monthly mood themes                                            |
| moodThemes.monthly[].date           | Date                   | No       | When the theme was generated                                   |
| moodThemes.monthly[].theme          | String                 | Yes      | The identified theme                                           |
| moodThemes.monthly[].description    | String                 | No       | Description of the theme                                       |
| journalThemes                       | Object                 | No       | Themes identified from user's journal entries                  |
| journalThemes.weekly                | Array                  | No       | Weekly journal themes                                          |
| journalThemes.weekly[].date         | Date                   | No       | When the theme was generated                                   |
| journalThemes.weekly[].theme        | String                 | Yes      | The identified theme                                           |
| journalThemes.weekly[].description  | String                 | No       | Description of the theme                                       |
| journalThemes.monthly               | Array                  | No       | Monthly journal themes                                         |
| journalThemes.monthly[].date        | Date                   | No       | When the theme was generated                                   |
| journalThemes.monthly[].theme       | String                 | Yes      | The identified theme                                           |
| journalThemes.monthly[].description | String                 | No       | Description of the theme                                       |
| chatThemes                          | Object                 | No       | Themes identified from user's chat interactions                |
| chatThemes.weekly                   | Array                  | No       | Weekly chat themes                                             |
| chatThemes.weekly[].date            | Date                   | No       | When the theme was generated                                   |
| chatThemes.weekly[].theme           | String                 | Yes      | The identified theme                                           |
| chatThemes.weekly[].description     | String                 | No       | Description of the theme                                       |
| chatThemes.monthly                  | Array                  | No       | Monthly chat themes                                            |
| chatThemes.monthly[].date           | Date                   | No       | When the theme was generated                                   |
| chatThemes.monthly[].theme          | String                 | Yes      | The identified theme                                           |
| chatThemes.monthly[].description    | String                 | No       | Description of the theme                                       |

### Relationships

- Many-to-one with User (belongs to a user)
- One-to-many with Chat sessions (referenced in chats)
- Referenced by Insight model

### Usage Context

The UserContext model provides a holistic view of the user's goals, struggles, and patterns over time. It serves as the foundation for personalized insights and therapeutic AI responses. The model stores both user-defined information (goals, struggles) and AI-generated information (themes derived from user activities).

## Journal Model

Stores user's journal entries with AI-generated summaries and emotional analysis.

### Schema Fields

| Field            | Type                   | Required | Description                                                      |
| ---------------- | ---------------------- | -------- | ---------------------------------------------------------------- |
| userId           | ObjectId (ref: 'User') | Yes      | Reference to the user                                            |
| entry            | String                 | Yes      | The journal entry text content                                   |
| emotions         | [String]               | No       | Array of emotions identified in the entry                        |
| tags             | [String]               | No       | User-defined tags for the entry                                  |
| summaryStatus    | String (enum)          | No       | Status of AI summary generation ('pending', 'complete', 'error') |
| summaryError     | String                 | No       | Error message if summarization failed                            |
| summaries        | Object                 | No       | AI-generated summaries of the journal entry                      |
| summaries.small  | String                 | No       | Short summary (25-50 words)                                      |
| summaries.medium | String                 | No       | Medium summary (75-125 words)                                    |
| summaries.large  | String                 | No       | Detailed summary (150-250 words)                                 |

### Relationships

- Many-to-one with User (belongs to a user)
- Indirectly related to UserContext via themes

### Usage Context

The Journal model captures the user's written reflections and thoughts. AI processing extracts emotions and generates summaries at different lengths to help users review their journal entries more efficiently. These entries are also analyzed to identify recurring themes that are stored in the UserContext model.

## Mood Model

Tracks user's mood entries including emotions and optional descriptions.

### Schema Fields

| Field       | Type                   | Required | Description                                        |
| ----------- | ---------------------- | -------- | -------------------------------------------------- |
| userId      | ObjectId (ref: 'User') | Yes      | Reference to the user                              |
| emotions    | [String]               | Yes      | Array of emotions selected by the user             |
| description | String                 | No       | Optional description or context for the mood entry |

### Relationships

- Many-to-one with User (belongs to a user)
- Indirectly related to UserContext via themes

### Usage Context

The Mood model provides a simple mechanism for users to record their emotional state. These records are analyzed over time to identify patterns and themes which are stored in the UserContext model. This data helps provide targeted insights and therapeutic responses.

## Chat Model

Stores conversations between the user and the AI therapist along with summaries.

### Schema Fields

| Field                | Type                          | Required | Description                                                   |
| -------------------- | ----------------------------- | -------- | ------------------------------------------------------------- |
| userId               | ObjectId (ref: 'User')        | Yes      | Reference to the user                                         |
| userContext          | ObjectId (ref: 'UserContext') | Yes      | Reference to the user's context                               |
| title                | String                        | No       | Title of the chat (defaults to "New Chat")                    |
| messages             | Array                         | No       | Collection of messages in the conversation                    |
| messages[].sender    | String (enum)                 | Yes      | Who sent the message ('user' or 'ai')                         |
| messages[].content   | String                        | Yes      | Content of the message                                        |
| messages[].timestamp | Date                          | No       | When the message was sent                                     |
| summary              | String                        | No       | AI-generated summary of the conversation                      |
| summaryStatus        | String (enum)                 | No       | Status of summary generation ('pending', 'complete', 'error') |
| summaryError         | String                        | No       | Error message if summarization failed                         |

### Relationships

- Many-to-one with User (belongs to a user)
- Many-to-one with UserContext (references user context)
- Indirectly related to Insights via themes

### Usage Context

The Chat model represents therapeutic conversations between the user and the AI. It maintains the conversation history, which is used to provide contextually relevant responses. The conversations are summarized for user review and analyzed to identify themes that are stored in the UserContext model.

## Insight Model

Stores AI-generated insights and suggestions based on user's data.

### Schema Fields

| Field                     | Type                          | Required | Description                                                    |
| ------------------------- | ----------------------------- | -------- | -------------------------------------------------------------- |
| userId                    | ObjectId (ref: 'User')        | Yes      | Reference to the user                                          |
| userContext               | ObjectId (ref: 'UserContext') | No       | Reference to the user's context                                |
| lastWeeklyUpdate          | Date                          | No       | Last time weekly insights were generated                       |
| lastWeeklyUpdateStatus    | String (enum)                 | No       | Status of last weekly update ('pending', 'complete', 'error')  |
| lastWeeklyUpdateError     | String                        | No       | Error message if weekly update failed                          |
| lastMonthlyUpdate         | Date                          | No       | Last time monthly insights were generated                      |
| lastMonthlyUpdateStatus   | String (enum)                 | No       | Status of last monthly update ('pending', 'complete', 'error') |
| lastMonthlyUpdateError    | String                        | No       | Error message if monthly update failed                         |
| weekly                    | Array                         | No       | Weekly insights                                                |
| weekly[].date             | Date                          | No       | When the insight was generated                                 |
| weekly[].insight          | String                        | Yes      | The insight content                                            |
| weekly[].description      | String                        | No       | Detailed explanation of the insight                            |
| monthly                   | Array                         | No       | Monthly insights                                               |
| monthly[].date            | Date                          | No       | When the insight was generated                                 |
| monthly[].insight         | String                        | Yes      | The insight content                                            |
| monthly[].description     | String                        | No       | Detailed explanation of the insight                            |
| suggestions               | Array                         | No       | Actionable suggestions for the user                            |
| suggestions[].date        | Date                          | No       | When the suggestion was generated                              |
| suggestions[].suggestion  | String                        | Yes      | The suggestion content                                         |
| suggestions[].description | String                        | No       | Detailed explanation of the suggestion                         |

### Relationships

- Many-to-one with User (belongs to a user)
- Many-to-one with UserContext (references user context)

### Usage Context

The Insight model stores AI-generated analyses and recommendations based on patterns observed in the user's activities. These insights are presented to users to help them better understand their emotional patterns, behaviors, and progress. Suggestions provide actionable steps users can take to address their struggles and achieve their goals.
