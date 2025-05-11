# Categories Management Feature

This feature provides functionality to manage categories, their destinations, and their associated metadata.

## Overview

The Categories Management feature allows administrators to:

- View all available categories and their destinations
- Add new categories
- Edit existing categories
- Delete categories
- View detailed information about a category
- Add, edit, and delete destinations within categories
- Configure type options and extra properties schemas for each destination

## Components Structure

- **Pages**

  - `CategoriesManagementPage`: Main page for managing categories

- **Components**

  - `CategoryList`: Displays a list of all categories
  - `CategoryDetail`: Shows detailed information about a specific category
  - `CategoryForm`: Form for adding or editing categories
  - `DestinationForm`: Form for adding or editing destinations
  - `JsonSchemaEditor`: Component for editing JSON schemas
  - `ConfirmationDialog`: Dialog for confirming delete actions

- **Hooks**

  - `useCategoriesManager`: Hook for managing categories data

- **Types**
  - Various TypeScript types for category, destination, and form data

## Data Structure

Each category contains:

- A name (identifier)
- A schema ID
- A collection of destinations

Each destination contains:

- A name (identifier)
- Type options with field name and available options
- Extra properties schema in JSON Schema format

## Usage

Access the Categories Management page via the "Categories" navigation link in the main navbar.

## Current Implementation Status

This is currently a standalone mock implementation that uses React state to manage data. It does not connect to any backend API or integrate with other parts of the application. The initial data is loaded from the mock categories info file.
