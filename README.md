# Expense Splitter Frontend

A React-based frontend for managing and splitting expenses among groups. This application allows users to create groups, add expenses, and track balances efficiently.

## Features

- **Group Management:** Create and manage groups for splitting expenses.
- **Expense Tracking:** Add, edit, and delete expenses within groups.
- **Balance Calculation:** Automatically calculates who owes whom.
- **User Authentication:** Secure login and registration (if backend supports).
- **Responsive Design:** Works seamlessly on desktop and mobile devices.

## Technologies Used

- **React** (with Hooks)
- **Redux** (for state management)
- **Axios** (for API requests)
- **React Router** (for navigation)
- **Material-UI** (for UI components)

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/expensesplitter-frontend.git
cd expensesplitter-frontend
npm install
```

### Running the App

```bash
npm start
```

The app will run at [http://localhost:3000](http://localhost:3000).

## Configuration

Update API endpoints in `src/config.js` to match your backend server.

## Folder Structure

```
src/
    components/
    pages/
    redux/
    utils/
    App.js
    index.js
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or feedback, open an issue or contact [your.email@example.com](mailto:your.email@example.com).
