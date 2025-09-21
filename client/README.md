# Company Review Website - Frontend

A modern React frontend for the Company Review Website built with Vite, React Router, and Tailwind CSS.

## Features

- **Company List**: Browse companies with search, filters, and pagination
- **Company Details**: View detailed company information and reviews
- **Add Company**: Modal form to add new companies
- **Add Review**: Modal form to submit reviews with star ratings
- **Review Management**: Sort reviews by date and rating
- **Responsive Design**: Mobile-first responsive design
- **Modern UI**: Clean, professional interface with Tailwind CSS

## Tech Stack

- **React 19** - Frontend framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CompanyCard.jsx     # Company card component
│   ├── AddCompanyModal.jsx # Add company modal
│   ├── AddReviewModal.jsx  # Add review modal
│   ├── ReviewCard.jsx      # Review card component
│   └── ReviewList.jsx      # Review list with sorting
├── pages/               # Page components
│   ├── CompanyList.jsx     # Main companies page
│   └── CompanyDetail.jsx   # Company detail page
├── services/            # API services
│   └── api.js              # Axios API configuration
├── App.jsx              # Main app component with routing
├── main.jsx             # App entry point
└── index.css            # Global styles with Tailwind
```

## Components

### CompanyList
- Displays grid of company cards
- Search and filter functionality
- Pagination support
- Add company button

### CompanyDetail
- Company information display
- Reviews section with sorting
- Add review functionality
- Company management actions

### AddCompanyModal
- Form validation
- Image URL validation
- Date validation
- Error handling

### AddReviewModal
- Interactive star rating
- Form validation
- Character count
- Error handling

## API Integration

The frontend communicates with the backend through the `api.js` service:

- **Company API**: CRUD operations for companies
- **Review API**: CRUD operations for reviews
- **Error Handling**: Centralized error handling
- **Request/Response Interceptors**: Logging and error management

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable component classes
- **Responsive Design**: Mobile-first approach
- **Color Scheme**: Professional blue and gray palette
- **Icons**: Lucide React icon library

## Features

### Search & Filter
- Search by company name or description
- Filter by city and location
- Sort by various criteria
- Real-time search

### Reviews
- Star rating system (1-5 stars)
- Review sorting (date, rating)
- Pagination
- Character validation

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interactions
- Accessible design

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- ESLint configuration included
- Consistent component structure
- Proper error handling
- Accessibility considerations

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include responsive design
4. Test on multiple devices
5. Update documentation as needed