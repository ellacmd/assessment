# BetterStudio Log Viewer Challenge

![Demo Screenshot](/public/screenshot.png)

A responsive log viewer interface with filtering, pagination and sorting.

## Features

-   **Comprehensive Log Display**

    -   Timestamp parsing and formatting
    -   Color-coded log messages (ERROR, WARN, INFO)
    -   Responsive table layout

-   **Advanced Filtering**

    -   Search across all fields (message, trace, authorId)
    -   Exact log message filtering
    -   Date range selection

-   **Client-Side Pagination**

    -   Dynamic page sizing (10, 25, 50, 100 items)
    -   Smart page number rendering
    -   Performance-optimized rendering

-   **API Integration**
    -   Error handling with fallback UI
    -   Type-safe response parsing

## Technical Implementation

### Key Decisions

1. **Frontend Architecture**

    - Next.js App Router
    - TypeScript interfaces for all data structures
    - TailwindCSS for styling

2. **API Key Handling**

    - Base64 encoding to prevent special character issues
    - Runtime decoding for header injection
    - Environment variable configuration

3. **Performance Optimizations**
    - Memoized filtered results

### Development Challenges

-   Solved API key truncation from special characters
-   Implemented responsive table with overflow handling
-   Created reusable pagination component

## Setup Instructions

1. Clone repository:

    ```bash
    git clone []
    cd betterstudio-assessment

    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

    ```bash
    # Create a .env.local file in the project root
    touch .env.local
    ```

    You'll need to encode your API key in Base64 format. You can do this by:

    a. Opening your browser's developer console (F12)
    b. Running the following command:

    ```javascript
    btoa('your-api-key-here');
    ```

    c. Copy the resulting Base64 string

    Add the encoded key to your `.env.local` file:

    ```bash
    NEXT_PUBLIC_API_KEY_BASE64="your-base64-encoded-key-here"
    ```

    Note: Replace "your-base64-encoded-key-here" with the actual Base64 string you generated.

4. Run development server

    ```bash
    npm run dev


    ```

### Demo Video

[Loom Walkthrough]()
