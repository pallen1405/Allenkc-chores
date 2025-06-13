# Allen Family Chore Tracker

A simple web application for tracking chores and payments for children in the Allen family.

## Features

- **Multiple Children Support**: Specifically designed for Izzy, Charlie, and Judah Allen
- **Parent Dashboard**: Allows parents to assign chores and track progress
- **Chore Assignment**: Parents can assign chores to specific children with custom payment rates
- **Completion Tracking**: Children can mark chores as complete with automatic timestamp
- **Payment Tracking**: Shows earned and paid amounts
- **Data Persistence**: All chores and completion status are saved in local storage
- **Parent Controls**: Only parent can mark chores as paid
- **PIN Management**: Parent can reset children's PINs
- **Data Export**: Export all chore data as CSV for record-keeping
- **Mobile-Friendly**: Responsive design works on phones and tablets

## How to Use

### For Parents

1. Login with the username "Parent" and PIN "0000"
2. Use the dashboard to assign new chores to specific children
3. View all children's chores and their completion status
4. Mark chores as paid once completed
5. Reset children's PINs when needed
6. Export chore data as CSV for record-keeping
7. Monitor progress and payment status

### For Children

1. Login with your name (Izzy Allen, Charlie Allen, or Judah Allen) and your PIN
2. View your assigned chores
3. Check off completed chores
4. Track your earnings

## Technical Details

- Built with vanilla JavaScript, HTML, and CSS
- Uses localStorage for data persistence
- No server or database required - all data is stored in the browser
- Mobile responsive design adapts to different screen sizes

## Setup

Simply open the index.html file in your web browser. No installation or server setup required.
