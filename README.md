# Dartsee Assessment

This repository contains my solution for take-home assignment for Dartsee. The project is built using React with Typescript on the frontend and Node.js with Typescript (using Express) on the backend.

## Pre-requisites

- Node.js
- pnpm (package manager)
- [Overmind](https://github.com/DarthSim/overmind) (for running the whole application with a single command)

## Setup Instructions

Install the dependencies for both the frontend and backend:

```bash
pnpm install
```

## Running the Application

To start the application, run the following command:

```bash
oms
```

## Implementation Details

All requested features have been implemented, including:

- Game listing (with pagination)
- Game details view containing all the required information, such as:
    - List of players participated in the game
    - Average score per round
    - Number of missed throws
- Game statistics view with a pie chart
- The +1 feature is a throw map next to each player in the game details view, showing the distribution of their throws across the board.

## Running Test Suite

To run the test suite, use the following command:

```bash
pnpm test
pnpm test:e2e
```


## Further improvement options

- Move the Pie chart to a separate component and make it reusable across the application. Since it's only used in one place, I decided to keep it in the same file for simplicity.
