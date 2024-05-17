# Cloud Clicker

**Cloud Clicker** is an interactive web application that tracks and displays the number of times a button has been clicked globally. The application is designed to be engaging and informative, providing users with immediate feedback on their actions and detailed insights into click activity over time.

## Functionalities

### Global Click Counter
The homepage prominently features a global click counter, which displays the total number of clicks accumulated by all users. This counter updates in real-time, ensuring that users always see the most current data.

### User Authentication
Users must log in to participate in the clicking activity. This ensures that only authenticated users can contribute to the global click count. The authentication process is handled securely using Firebase Authentication.

### Personal Contribution Tracking
Once logged in, users can see their personal contribution to the global click count. This feature enhances user engagement by allowing them to track their individual impact.

## Features

### Live Updates
The click counter updates in real-time, reflecting the total number of clicks instantly as users interact with the button. This live update feature ensures that users always see the most accurate and current data.

### Authentication
To participate in the clicking activity, users must log in. This secure authentication process is managed by Firebase Authentication, ensuring that only authorized users can click the button and contribute to the global count.

### Personalized Data
Authenticated users can track their personal contributions to the total click count. This feature allows users to see their individual impact on the global count, enhancing their engagement and involvement with the application.

### Logging
The application includes robust logging mechanisms to capture various events and errors. Depending on business needs, different logging options are available to ensure that all relevant information is recorded for monitoring and debugging purposes.

### Monitoring
Monitoring is set up using third-party services such as Sentry. This allows for real-time tracking of application performance and errors, helping maintain the application's reliability and stability.

### Dashboard
Beyond displaying the number of clicks, the application features a detailed dashboard. The dashboard includes a "Clicks vs. Time" graph, which shows the number of clicks per minute for a specified number of hours. This graph provides users with insights into click patterns and trends over time. Logged-in users can also view their own click activity on the dashboard.
