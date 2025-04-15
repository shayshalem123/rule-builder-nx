
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { MantineProvider, Container, createTheme, AppShell, Box, Text } from '@mantine/core';

const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  primaryColor: 'blue',
});

const Layout: React.FC = () => {
  return (
    <MantineProvider theme={theme}>
      <AppShell
        header={{ height: 60 }}
        padding="md"
      >
        <AppShell.Header>
          <Navbar />
        </AppShell.Header>
        
        <AppShell.Main bg="gray.0">
          <Container size="xl" py="md">
            <Outlet />
          </Container>
        </AppShell.Main>
        
        <AppShell.Footer p="md">
          <Box ta="center">
            <Text size="sm" c="dimmed">
              Rule Builder - {new Date().getFullYear()}
            </Text>
          </Box>
        </AppShell.Footer>
      </AppShell>
    </MantineProvider>
  );
};

export default Layout;
