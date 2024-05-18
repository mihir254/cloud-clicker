# The Thought Process Behind Cloud Clicker

### Introduction

While designing the solution, I had set a few checkpoints, and the first one was to create a Minimum Viable Product (MVP). This product consisted of only a button, a counter, and a single-collection database to persist click events. While building on top of this MVP, I made certain design decisions and choices and added a few more features. The complete list of features can be viewed in the `README.md` file.

### Design Decisions

#### Database Selection

**Choice of Database**:
Given the requirement to store clicks persistently and provide quick lookups, a NoSQL database was ideal due to its schema-less nature and ability to handle large volumes of unstructured data efficiently. While MongoDB is a robust NoSQL option offering diverse features, Firebase Firestore was chosen primarily because of its seamless integration with Firebase Authentication. This integration simplifies the management of user authentication and real-time database updates, enhancing both **maintainability** and **scalability**.

**Firestore Collections**:
- **TotalClicks Collection**: Initially, a single collection named `TotalClicks` was created to store a document `counter` with a field `total` to keep track of the total number of clicks. This design allowed for quick lookups and updates of the total click count, ensuring minimal **latency**.
- **Users Collection**: Upon implementing user authentication, a new collection `Users` was created. Each document in this collection represents a user, identified by their `userId` from Firebase Authentication, and contains fields like `username` and `clickCount`, which tracks the number of clicks made by the user.

#### Handling Click Events

**Click Event Flow**:
1. **Frontend Event Capture**: When a user clicks the button, an event is captured on the frontend.
2. **API Call**: This event triggers an API call to verify the user's authenticity and increment the click count in the database.
3. **Database Transaction**: The API verifies the user token, retrieves the `uid`, and updates the click count in Firestore within a transaction. The transaction ensures atomicity, so either all updates succeed, or none do, preventing inconsistent states.
4. **Frontend Update**: Once the API responds, the frontend updates the click count display accordingly.

**Trade-offs and Decisions**:
- **Optimistic UI Updates vs. Accurate Feedback**:
  - **Optimistic UI Updates**: This approach involves immediately updating the UI in anticipation of a successful backend update. This provides a fast and responsive user experience.
    - **Pros**: 
      - Enhanced user experience due to immediate feedback.
      - Perceived application speed and responsiveness.
    - **Cons**:
      - Potential inconsistency between the UI and actual data if backend updates fail.
      - Possible user confusion if the UI shows incorrect information.
  - **Accurate Feedback**: The chosen approach was to wait for backend confirmation before updating the UI, prioritizing accuracy and building user trust. This ensures that the click counts displayed are always consistent with the database.
    - **Pros**:
      - High reliability and consistency of displayed data.
      - Builds and maintains user trust through accurate information.
    - **Cons**:
      - Slightly delayed feedback due to the wait for backend confirmation.

Given the application's goals, **reliability**, **accuracy**, and user **trust** were prioritized over providing a fast click user experience.

Another way for handling this is to employ a message queue, using services like RabbitMQ, where you are capturing the event from the frontend, pushing the request to the queue and while the requests are handled by the server in FIFO manner, the frontend is continuously listening to job completion notifications. Given the constraints of this project, I thought it was best to start with the "Accurate Feedback" approach and later grow into other solutions if required.

#### Logging and Monitoring

**Logging**:
The application incorporates three logging mechanisms, each with its own advantages and trade-offs:
1. **Winston Logger**: Logs events to a file system.
    - **Pros**: Comprehensive logging with customizable log levels and formats.
    - **Cons**: Increases project directory size and is not supported in serverless environments like Vercel due to write restrictions.
2. **Firestore Logging**: Logs click events to the `Clicks` collection in Firestore.
    - **Pros**: Allows for detailed tracking and analytics, and integrates seamlessly with existing Firestore data.
    - **Cons**: Increased read/write operations can affect **performance** and incur additional costs.
3. **Sentry Monitoring**: Captures exceptions and events, providing detailed insights for debugging.
    - **Pros**: Real-time error tracking and detailed diagnostic information.
    - **Cons**: Dependency on an external service, with potential cost implications after the free trial.

Given Vercel's restrictions, Winston logging is currently commented out, and Firestore is used for logging clicks. Sentry is used for monitoring but is on a free trial. The logging mechanism can be configured based on specific **business requirements** and **scalability** needs.

#### Data Storage and Aggregation

**Clicks Collection**:
- **Structure**: Each click event is recorded as a document in the `Clicks` collection, containing fields like `timestamp` and `userId`. This design supports detailed tracking and analytics.
- **Aggregation**: Initially considered aggregating user click counts directly from the `Users` collection. However, with potential high user numbers, this could lead to performance bottlenecks. Thus, maintaining a separate `TotalClicks` collection for quick lookups was deemed more efficient.

#### Real-Time Updates

**Firestore Listeners**:
- Implemented listeners on the frontend to listen for changes in the Firestore database. This ensures that any update to the click count is instantly reflected across all clients. This real-time capability is a significant advantage of using Firebase Firestore, enhancing **user experience** by providing immediate feedback.

#### Performance and Scalability

**Performance Considerations**:
- **Firestore Indexing**: Ensured that the Firestore collections and fields used in queries are indexed, providing efficient query performance even as data volumes grow. For example, to aggregate total and user-specific clicks over a period using a composite index on `Clicks` significantly improves performance.
- **API Rate Limiting**: Implemented middleware to rate limit API requests, preventing abuse and ensuring fair usage. This is crucial for maintaining **application performance** and **reliability**.

**Possible Improvements**:
- **Caching**: Implementing server-side caching for frequently accessed data to reduce read operations on Firestore and improve **latency**.

**Scalability**:
- **Serverless Deployment**: Deployed the application on Vercel, leveraging its serverless architecture to automatically scale with traffic. This ensures that the application can handle varying loads without manual intervention.
- **Firestore Scalability**: Firebase Firestore automatically scales to handle increased data and traffic, making it a suitable choice for applications expecting growth.

**Possible Improvements**:
- **Horizontal Scaling**: Implementing horizontal scaling strategies, such as splitting data across multiple collections or databases if a single Firestore instance becomes a bottleneck.

#### Security

**Authentication and Authorization**:
- **Firebase Authentication**: Securely manages user authentication, ensuring that only authenticated users can perform certain actions like clicking the button.
- **Token Verification**: Each API call verifies the user's token, adding a layer of security to prevent unauthorized access.

**Environment Variables**:
- Sensitive information such as API keys and private keys are stored in environment variables, preventing exposure in the codebase and ensuring secure configuration management.

**Possible Improvements**:
- **Role-Based Access Control (RBAC)**: Introduce RBAC to provide different levels of access to different users, improving security and control.

### Future Scope
- **Leaderboard**: This application can be converted to a game and along with capturing individual clicks, we also calculate user's score. We can then keep a track of the highest scores and display a leaderboard, hence arousing a sense of competition among users and potentially increasing participation. A good example for such a game would be having a ball move randomly on the screen and a click is only captured if the user clicks on the ball!

### Summary

The design and development of Cloud Clicker involved several key decisions and trade-offs aimed at balancing **performance**, **reliability**, **scalability**, and **user experience**. By leveraging Firebase Firestore and Authentication, integrating robust logging and monitoring solutions, and ensuring real-time updates, the application provides a seamless and engaging experience for users. The strategic choices made in data storage, click handling, and system architecture ensure that the application is scalable, secure, and maintainable. Potential improvements have been identified to further enhance these aspects, ensuring the application can grow and adapt to future needs.

---
