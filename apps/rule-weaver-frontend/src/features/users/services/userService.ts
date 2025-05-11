import { User } from "../types/user";

// Mock user data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=jane",
    role: "admin",
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=john",
    role: "user",
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user service
export const userService = {
  // Get current user (mocked as always returning the first user)
  getCurrentUser: async (): Promise<User> => {
    await delay(300); // Simulate network delay
    return mockUsers[0]; // Always return Jane Doe as the current user
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | undefined> => {
    await delay(200);
    return mockUsers.find((user) => user.id === id);
  },

  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    await delay(300);
    return [...mockUsers];
  },
};
